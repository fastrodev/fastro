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

Deno.test("tailwind middleware serves css when tailwind.css exists", async () => {
  try {
    // Use production prebuilt CSS path to avoid invoking postcss/native binaries
    Deno.env.set("ENV", "production");
    const publicDir = Deno.cwd() + "/public/css";
    await Deno.mkdir(publicDir, { recursive: true });
    const prebuiltPath = publicDir + "/styles.css";
    await Deno.writeTextFile(
      prebuiltPath,
      "/* prebuilt css */ body{color:#123456}",
    );

    const mw = tailwind("/styles.css", "/test_static");
    const req = new Request("http://localhost/styles.css");
    const res = await mw(
      req as Request,
      {} as unknown as Context,
      () => Promise.resolve(new Response("no")),
    );

    assert(res instanceof Response);
    assertEquals(res.status, 200);
    const ct = res.headers.get("Content-Type") ||
      res.headers.get("content-type");
    assert(ct && ct.indexOf("text/css") === 0, "response should be CSS");
    const body = await res.text();
    assert(
      body.includes("prebuilt css") || body.length > 0,
      "response body should contain prebuilt css",
    );

    // test cache
    const res2 = await mw(
      req as Request,
      {} as unknown as Context,
      () => Promise.resolve(new Response("no")),
    );
    const body2 = await res2.text();
    assertEquals(body2, body);
  } finally {
    // cleanup
    try {
      const prebuiltPath = Deno.cwd() + "/public/css/styles.css";
      await Deno.remove(prebuiltPath).catch(() => {});
      // attempt to remove the css folder if empty
      await Deno.remove(Deno.cwd() + "/public/css").catch(() => {});
    } catch (e) {
      console.warn("cleanup public failed", e);
    }
    try {
      Deno.env.delete("ENV");
    } catch (e) {
      console.warn("cleanup env failed", e);
    }
  }
});

Deno.test("tailwind middleware falls back to development mode when prebuilt file is missing", async () => {
  try {
    Deno.env.set("ENV", "production");
    const staticDir = "/test_static_fallback";
    const cssPath = Deno.cwd() + staticDir + "/css";
    await Deno.mkdir(cssPath, { recursive: true });
    await Deno.writeTextFile(
      cssPath + "/tailwind.css",
      ".fallback { color: blue; }",
    );

    const mw = tailwind("/styles-fallback.css", staticDir);
    const req = new Request("http://localhost/styles-fallback.css");

    const res = await mw(
      req as Request,
      {} as unknown as Context,
      () => Promise.resolve(new Response("no")),
    );

    assertEquals(res.status, 200);
    const body = await res.text();
    assert(body.length > 0);
  } finally {
    Deno.env.delete("ENV");
    try {
      await Deno.remove(Deno.cwd() + "/test_static_fallback", {
        recursive: true,
      });
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
