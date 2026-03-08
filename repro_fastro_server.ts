import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import App from "./mod.ts";
import { staticFiles } from "./middlewares/static/static.ts";

Deno.test("repro - Fastro + staticFiles fallback with real server", async () => {
  const tempDir = await Deno.makeTempDir();
  await Deno.writeTextFile(`${tempDir}/index.html`, "fallback content");
  await Deno.writeTextFile(`${tempDir}/style.css`, "body { color: red; }");

  try {
    const app = new App();

    // Route priority (Registered AFTER middleware BUT in modern Fastro they are separate collections)
    app.get("/api", () => "api content");

    // Static middleware
    app.use(staticFiles("/", tempDir, { fallback: "index.html" }));

    const server = app.serve({ port: 3001 });

    try {
      // 1. Route
      const resp1 = await fetch("http://localhost:3001/api");
      assertEquals(await resp1.text(), "api content");

      // 2. Static File
      const resp2 = await fetch("http://localhost:3001/style.css");
      assertEquals(await resp2.text(), "body { color: red; }");

      // 3. Fallback
      const resp3 = await fetch("http://localhost:3001/not-found");
      assertEquals(await resp3.text(), "fallback content");
      assertEquals(resp3.status, 200);
    } finally {
      await server.close();
    }
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});
