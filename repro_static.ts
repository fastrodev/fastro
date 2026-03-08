import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { staticFiles } from "./middlewares/static/static.ts";
import { Context } from "./core/types.ts";

Deno.test("repro - staticFiles polite behavior", async () => {
  const tempDir = await Deno.makeTempDir();
  await Deno.writeTextFile(`${tempDir}/index.html`, "fallback content");
  await Deno.writeTextFile(`${tempDir}/style.css`, "body { color: red; }");

  try {
    const middleware = staticFiles("/", tempDir, { fallback: "index.html" });
    const ctx = {} as Context;

    // 1. Test existing route (Priority)
    // Simulating a router that has a route for "/"
    const nextRoute = () =>
      Promise.resolve(new Response("route content", { status: 200 }));
    const resp1 = await middleware(
      new Request("http://localhost/"),
      ctx,
      nextRoute,
    );
    assertEquals(await resp1.text(), "route content");

    // 2. Test missing route, existing static file
    const nextNotFound = () =>
      Promise.resolve(new Response("Not found", { status: 404 }));
    const resp2 = await middleware(
      new Request("http://localhost/style.css"),
      ctx,
      nextNotFound,
    );
    assertEquals(await resp2.text(), "body { color: red; }");

    // 3. Test missing route, missing static file (Fallback)
    const resp3 = await middleware(
      new Request("http://localhost/non-existent"),
      ctx,
      nextNotFound,
    );
    assertEquals(await resp3.text(), "fallback content");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});
