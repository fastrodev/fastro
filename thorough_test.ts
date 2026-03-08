import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { staticFiles } from "./middlewares/static/static.ts";
import { Context } from "./core/types.ts";

Deno.test("Thorough staticFiles Test", async (t) => {
  const tempDir = await Deno.makeTempDir();
  await Deno.mkdir(`${tempDir}/public`);
  await Deno.writeTextFile(`${tempDir}/public/index.html`, "static home");
  await Deno.writeTextFile(`${tempDir}/public/app.js`, "console.log(1)");
  await Deno.mkdir(`${tempDir}/public/assets`);
  await Deno.writeTextFile(`${tempDir}/public/assets/logo.png`, "logo-data");

  const middleware = staticFiles("/", `${tempDir}/public`, {
    fallback: "index.html",
  });
  const ctx = {} as Context;

  await t.step("Scenario 1: Route exists at /dashboard", async () => {
    // Router has /dashboard
    const next = () =>
      Promise.resolve(new Response("dashboard content", { status: 200 }));
    const resp = await middleware(
      new Request("http://localhost/dashboard"),
      ctx,
      next,
    );
    assertEquals(await resp.text(), "dashboard content");
    assertEquals(resp.status, 200);
  });

  await t.step("Scenario 2: Static file exists at /app.js", async () => {
    // Router does not have /app.js
    const next = () =>
      Promise.resolve(new Response("Not found", { status: 404 }));
    const resp = await middleware(
      new Request("http://localhost/app.js"),
      ctx,
      next,
    );
    assertEquals(await resp.text(), "console.log(1)");
    assertEquals(resp.headers.get("Content-Type"), "application/javascript");
  });

  await t.step(
    "Scenario 3: SPA Fallback for unknown path /anywhere",
    async () => {
      // Router does not have /anywhere
      const next = () =>
        Promise.resolve(new Response("Not found", { status: 404 }));
      const resp = await middleware(
        new Request("http://localhost/anywhere"),
        ctx,
        next,
      );
      assertEquals(await resp.text(), "static home");
      assertEquals(resp.status, 200);
    },
  );

  await t.step(
    "Scenario 4: Home page priority (Module vs Static)",
    async () => {
      // If router has / route
      const next = () =>
        Promise.resolve(new Response("module home", { status: 200 }));
      const resp = await middleware(
        new Request("http://localhost/"),
        ctx,
        next,
      );
      // With current "polite" logic, next() is called first, so module wins.
      assertEquals(await resp.text(), "module home");
    },
  );

  await t.step("Scenario 5: Non-GET method", async () => {
    const next = () => Promise.resolve(new Response("next", { status: 200 }));
    const resp = await middleware(
      new Request("http://localhost/app.js", { method: "POST" }),
      ctx,
      next,
    );
    assertEquals(await resp.text(), "next");
  });

  await t.step("Scenario 6: Different Prefix", async () => {
    const middlewareStatic = staticFiles("/static", `${tempDir}/public`);
    const next = () => Promise.resolve(new Response("next", { status: 404 }));

    // Valid: /static/app.js
    const resp1 = await middlewareStatic(
      new Request("http://localhost/static/app.js"),
      ctx,
      next,
    );
    assertEquals(await resp1.text(), "console.log(1)");

    // Invalid: /app.js (prefix doesn't match)
    const resp2 = await middlewareStatic(
      new Request("http://localhost/app.js"),
      ctx,
      next,
    );
    assertEquals(await resp2.text(), "next");
  });

  await Deno.remove(tempDir, { recursive: true });
});
