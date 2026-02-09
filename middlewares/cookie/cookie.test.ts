import { assertEquals, assertStringIncludes } from "@std/assert";
import { cookieMiddleware } from "./cookie.ts";
import { Context } from "../../core/types.ts";

Deno.test("cookieMiddleware - parses cookies and sets Set-Cookie header", async () => {
  const req = new Request("http://localhost/", {
    headers: { cookie: "a=1; b=two%20words" },
  });

  const ctx = {} as Context;

  let nextCalled = false;
  const next = () => {
    nextCalled = true;
    // downstream should see parsed cookies
    assertEquals(ctx.cookies?.a, "1");
    assertEquals(ctx.cookies?.b, "two words");

    // request a cookie to be set
    ctx.setCookie!("session", "abc123", { httpOnly: true, path: "/" });
    ctx.setCookie!("pref", " dark ");

    return Promise.resolve(new Response("ok", { headers: { "x-test": "1" } }));
  };

  const res = await cookieMiddleware(req, ctx, next);

  assertEquals(nextCalled, true);
  // original response header is preserved
  assertEquals(res.headers.get("x-test"), "1");

  const sc = res.headers.get("Set-Cookie") || "";
  // At least one cookie should be present in the header string
  assertStringIncludes(sc, "session=abc123");
  assertStringIncludes(sc, "HttpOnly");
  assertStringIncludes(sc, "Path=/");
});

Deno.test("cookieMiddleware - returns original response when no cookies set", async () => {
  const req = new Request("http://localhost/");
  const ctx = {} as Context;

  const next = () =>
    Promise.resolve(
      new Response("no-cookies", { headers: { "x-foo": "bar" } }),
    );

  const res = await cookieMiddleware(req, ctx, next);

  assertEquals(res.status, 200);
  assertEquals(res.headers.get("x-foo"), "bar");
  // Should not contain Set-Cookie header
  assertEquals(res.headers.get("Set-Cookie"), null);
});

Deno.test("cookieMiddleware - parses lone cookie name and decodes values", async () => {
  const req = new Request("http://localhost/", {
    headers: { cookie: "solo; encoded=%7B%22a%22%3A1%7D" },
  });

  const ctx = {} as Context;

  const next = () => {
    // downstream should see parsed cookies
    // lone name should map to empty string
    if (ctx.cookies?.solo !== "") throw new Error("solo not parsed");
    if (ctx.cookies?.encoded !== '{"a":1}') {
      throw new Error("encoded not decoded");
    }
    return Promise.resolve(new Response("ok"));
  };

  await cookieMiddleware(req, ctx, next);
});

Deno.test("cookieMiddleware - formats all cookie options and appends multiple headers", async () => {
  const req = new Request("http://localhost/");
  const ctx = {} as Context;

  const next = () => {
    // schedule multiple cookies with various options
    ctx.setCookie!("one", "v1", { maxAge: 3600, path: "/app" });
    ctx.setCookie!("two", "v two", {
      expires: new Date("2030-01-02T03:04:05Z"),
      domain: "example.com",
      secure: true,
      httpOnly: true,
      sameSite: "Lax",
    });
    ctx.setCookie!("three", "");
    return Promise.resolve(new Response("ok", { headers: { "x-test": "1" } }));
  };

  const res = await cookieMiddleware(req, ctx, next);

  // original header preserved
  if (res.headers.get("x-test") !== "1") throw new Error("x-test lost");

  // collect all Set-Cookie header values
  const setCookies: string[] = [];
  for (const [k, v] of res.headers) {
    if (k.toLowerCase() === "set-cookie") setCookies.push(v);
  }

  if (setCookies.length < 3) throw new Error("expected 3 Set-Cookie headers");

  // verify some option tokens present in the second cookie
  const second = setCookies.find((s) => s.includes("two=v%20two")) || "";
  if (!second.includes("Domain=example.com")) throw new Error("domain missing");
  if (!second.includes("HttpOnly")) throw new Error("HttpOnly missing");
  if (!second.includes("Secure")) throw new Error("Secure missing");
  if (!second.includes("SameSite=Lax")) throw new Error("SameSite missing");
  if (!setCookies[0].includes("Max-Age=3600")) {
    throw new Error("Max-Age missing");
  }
});

Deno.test("cookieMiddleware - ignores empty cookie segments and handles '=' in values", async () => {
  const req = new Request("http://localhost/", {
    headers: { cookie: "a=1=2; ; b=3; empty=" },
  });

  const ctx = {} as Context;

  const next = () => {
    if (ctx.cookies?.a !== "1=2") throw new Error("a value wrong");
    if (ctx.cookies?.b !== "3") throw new Error("b value wrong");
    if (ctx.cookies?.empty !== "") throw new Error("empty value wrong");

    ctx.setCookie!("s", "v", { sameSite: "None" });
    return Promise.resolve(new Response("ok"));
  };

  const res = await cookieMiddleware(req, ctx, next);
  const setCookies: string[] = [];
  for (const [k, v] of res.headers) {
    if (k.toLowerCase() === "set-cookie") setCookies.push(v);
  }
  const found = setCookies.find((s: string) => s.includes("SameSite=None"));
  if (!found) throw new Error("SameSite=None not present");
});
