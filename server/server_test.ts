import { HttpRequest, HttpResponse, Next } from "../types.d.ts";
import { assertEquals, Cookie, Status, STATUS_TEXT } from "./deps.ts";
import { fastro } from "./server.ts";

const host = "http://localhost:9000";

Deno.test({ permissions: { net: true } }, async function getMethod() {
  const app = fastro();
  app.get("/", (req: HttpRequest, res: HttpResponse) => {
    req.set("key1", "key1");
    req.get("key1");
    req.delete("key1");
    req.container();
    const cookie: Cookie = { name: "Space", value: "Cat" };

    const headers = new Headers();
    headers.set("x", "x");
    res.headers(headers);
    res.authorization("token");
    res.contentType("text/html; charset=utf-8");

    return res.setCookie(cookie).html("<div>Hello</div>");
  });

  const server = app.serve();

  const response = await fetch(host, { method: "GET" });

  const cookie = response.headers.get("Set-Cookie");

  const x = response.headers.get("x");

  assertEquals(cookie, "Space=Cat");
  assertEquals(x, "x");
  assertEquals(await response.text(), "<div>Hello</div>");

  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function postMethod() {
  const app = fastro();
  app.post("/", () => new Response("POST"));
  const server = app.serve();
  const response = await fetch(host, { method: "POST" });
  assertEquals(await response.text(), "POST");
  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function putMethod() {
  const app = fastro();
  app.put("/", () => new Response("PUT"));
  const server = app.serve();
  const response = await fetch(host, { method: "PUT" });
  assertEquals(await response.text(), "PUT");
  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function deleteMethod() {
  const app = fastro();
  app.delete("/", () => new Response("DELETE"));
  const server = app.serve();
  const response = await fetch(host, { method: "DELETE" });
  assertEquals(await response.text(), "DELETE");
  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function patchMethod() {
  const app = fastro();
  app.patch("/", () => new Response("PATCH"));
  const server = app.serve();
  const response = await fetch(host, { method: "PATCH" });
  assertEquals(await response.text(), "PATCH");
  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function optionsMethod() {
  const app = fastro();
  app.flash(false);
  app.options("/", () => new Response("OPTIONS"));
  const server = app.serve({
    port: 9000,
    onError: (err) => new Response(<string> err),
  });
  const response = await fetch(host, { method: "OPTIONS" });
  assertEquals(await response.text(), "OPTIONS");
  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function headMethod() {
  const app = fastro();
  app.head("/", () => new Response("HEAD"));
  const server = app.serve();
  const response = await fetch(host, { method: "HEAD" });
  assertEquals(await response.text(), "");
  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function middleware() {
  const app = fastro();
  app.get(
    "/",
    (_req: HttpRequest, _res: HttpResponse, next: Next) => {
      next();
    },
    (_req: HttpRequest, _res: HttpResponse, next: Next) => {
      next();
    },
    (_req: HttpRequest, res: HttpResponse, _next: Next) => res.send("GET"),
    () => "Hello world",
  );
  app.use(
    (_req, _res, next) => {
      next();
    },
    (req, res, next) => {
      if (req.method === "POST") {
        return res
          .status(Status.Forbidden)
          .json({
            status: Status.Forbidden,
            text: STATUS_TEXT[Status.Forbidden],
          });
      }
      next();
    },
  );

  const server = app.serve();

  let response = await fetch(host, { method: "POST" });
  let r = await response.text();
  assertEquals(r, `{"status":403,"text":"Forbidden"}`);

  response = await fetch(host, { method: "GET" });
  r = await response.text();
  assertEquals(r, `GET`);

  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function middleware() {
  const app = fastro();
  app.flash(false);
  app.get(
    "/",
    (_req: HttpRequest, _res: HttpResponse, next: Next) => {
      next(new Error("error"));
    },
    () => "Hello world",
  );

  const server = app.serve();

  const response = await fetch(host, { method: "GET" });
  const r = await response.text();
  assertEquals(r, `error`);

  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function middleware() {
  const app = fastro();
  app.flash(false);
  app.use((_req: HttpRequest, _res: HttpResponse, next: Next) => {
    next(new Error("error"));
  });

  const server = app.serve();

  const response = await fetch(host, { method: "GET" });
  const r = await response.text();
  assertEquals(r, `error`);
  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function params() {
  const app = fastro();
  app.get("/:user", (req: HttpRequest, res: HttpResponse) => {
    return res.json({ user: req.params("user"), title: req.query("title") });
  });
  const server = app.serve();
  const response = await fetch(`${host}/agus?title=lead`, { method: "GET" });
  const r = await response.text();
  assertEquals(r, `{"user":"agus","title":"lead"}`);
  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function params() {
  const app = fastro();
  app.get("/:user", (req: HttpRequest, res: HttpResponse) => {
    const p = <Record<string, string>> req.params();
    const q = <Record<string, string>> req.query();
    return res.json({ user: p.user, title: q.title });
  });
  const server = app.serve();
  const response = await fetch(`${host}/agus?title=lead`, { method: "GET" });
  const r = await response.text();
  assertEquals(r, `{"user":"agus","title":"lead"}`);
  app.close();
  await server;
});
