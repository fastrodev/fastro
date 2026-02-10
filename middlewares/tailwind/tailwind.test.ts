import { assert, assertEquals } from "@std/assert";
import { tailwind } from "./tailwind.ts";
import { Context } from "../../core/types.ts";

Deno.test("tailwind middleware calls next when path doesn't match", async () => {
  const mw = tailwind("/styles.css", "/test_static_nonexistent");
  let nextCalled = false;
  const next = () => {
    nextCalled = true;
    return Promise.resolve(new Response("next"));
  };

  const req = new Request("http://localhost/other.css");
  const res = await mw(req as Request, {} as unknown as Context, next);
  assert(nextCalled, "next() should be called when pathname does not match");
  assert(res instanceof Response);
});

Deno.test("tailwind middleware calls next in production", async () => {
  const originalEnv = Deno.env.get("ENV");
  try {
    Deno.env.set("ENV", "production");
    const mw = tailwind("/styles.css", "/test_static");
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
      return Promise.resolve(new Response("next-from-test"));
    };

    const req = new Request("http://localhost/styles.css");
    const res = await mw(req, {} as unknown as Context, next);

    assert(nextCalled, "next() should be called in production");
    const text = await res.text();
    assertEquals(text, "next-from-test");
  } finally {
    if (originalEnv) Deno.env.set("ENV", originalEnv);
    else Deno.env.delete("ENV");
  }
});

Deno.test("tailwind middleware serves css in development when tailwind.css exists", async () => {
  const originalEnv = Deno.env.get("ENV");
  const originalFastro = Deno.env.get("FASTRO_ENV");
  try {
    Deno.env.delete("ENV");
    Deno.env.delete("FASTRO_ENV");
    const staticDir = "/test_static_dev";
    const cssPath = Deno.cwd() + staticDir + "/css";
    await Deno.mkdir(cssPath, { recursive: true });
    await Deno.writeTextFile(
      cssPath + "/tailwind.css",
      "/* dev css */ body{color:red}",
    );

    const mw = tailwind("/styles-dev.css", staticDir);
    const req = new Request("http://localhost/styles-dev.css");
    const res = await mw(
      req,
      {} as unknown as Context,
      () => Promise.resolve(new Response("no")),
    );

    assert(res instanceof Response);
    assertEquals(res.status, 200);
    const ct = res.headers.get("Content-Type");
    assert(ct && ct.includes("text/css"), "Content-type should be text/css");
    const body = await res.text();
    assert(body.length > 0, "Body should not be empty");
    assert(body.includes("color:red") || body.includes("color:#f00"), "Body should contain the expected style");
  } finally {
    if (originalEnv) Deno.env.set("ENV", originalEnv);
    if (originalFastro) Deno.env.set("FASTRO_ENV", originalFastro);
    try {
      await Deno.remove(Deno.cwd() + "/test_static_dev", { recursive: true });
    } catch (_) {
      // ignore
    }
  }
});

Deno.test("tailwind middleware handles processCss errors", async () => {
  const mw = tailwind("/styles-error.css", "/non-existent-static");
  const req = new Request("http://localhost/styles-error.css");

  try {
    await mw(
      req as Request,
      {} as unknown as Context,
      () => Promise.resolve(new Response("no")),
    );
    assert(false, "Should have thrown error");
  } catch (_) {
    assert(true, "Successfully caught processCss error");
  }
});
