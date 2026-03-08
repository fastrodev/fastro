import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { Fastro as App } from "./mod.ts";
import { staticFiles } from "./middlewares/static/static.ts";

Deno.test("repro - Fastro + staticFiles fallback", async () => {
  const tempDir = await Deno.makeTempDir();
  await Deno.writeTextFile(`${tempDir}/index.html`, "fallback content");
  await Deno.writeTextFile(`${tempDir}/style.css`, "body { color: red; }");

  try {
    const app = new App();

    // Route priority
    app.get("/api", () => new Response("api content"));

    // Static middleware
    app.use(staticFiles("/", tempDir, { fallback: "index.html" }));

    const handler = (req: Request) =>
      app.serve({
        port: 0,
        handler: async (r) =>
          await app.serve().handler(r, {
            remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 80 },
          }),
      });
    // Actually, app.serve() returns a server object.

    // Let's use the internal handler directly if possible, but Fastro's serve is complex.
    // Instead, let's use a mock context or just call the middleware chain.

    const req1 = new Request("http://localhost/api");
    const resp1 = await app.serve().handler(req1, {
      remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 80 },
    });
    assertEquals(await resp1.text(), "api content");

    const req2 = new Request("http://localhost/style.css");
    const resp2 = await app.serve().handler(req2, {
      remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 80 },
    });
    assertEquals(await resp2.text(), "body { color: red; }");

    const req3 = new Request("http://localhost/not-found");
    const resp3 = await app.serve().handler(req3, {
      remoteAddr: { transport: "tcp", hostname: "127.0.0.1", port: 80 },
    });
    assertEquals(await resp3.text(), "fallback content");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});
