import { assertEquals } from "@std/assert";

Deno.test("e2e: app routes", async () => {
  const mod = await import("./app.ts");
  const app = mod.default;
  const s = app.serve({ port: 3135 });
  try {
    const r1 = await fetch("http://localhost:3135/user/42");
    assertEquals(await r1.text(), "User 42");

    // auto-registered module route: modules/user -> GET /user
    const mu = await fetch("http://localhost:3135/user");
    assertEquals(await mu.text(), "Hello from modules/user");

    // auto-registered index module: modules/index -> GET /
    const root = await fetch("http://localhost:3135/");
    assertEquals(await root.text(), "Hello from modules/root");

    const r2 = await fetch("http://localhost:3135/query?name=Anna");
    assertEquals(await r2.text(), "Hello Anna");

    const r3 = await fetch("http://localhost:3135/middleware");
    assertEquals(await r3.text(), "Hello fastro");

    const payload = { a: 1 };
    const r4 = await fetch("http://localhost:3135/json", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    assertEquals(await r4.json(), payload);

    // Verify all 10 global middlewares mutated ctx correctly
    const r5 = await fetch("http://localhost:3135/ctx-check");
    const ctx = await r5.json();
    assertEquals(ctx.requestId, "req-123");
    assertEquals(ctx.logged, true);
    assertEquals(ctx.corsOrigin, "*");
    assertEquals(ctx.securityHeaders, true);
    assertEquals(ctx.rateLimit, 100);
    assertEquals(ctx.sessionId, "sess-abc");
    assertEquals(ctx.authUser, "admin");
    assertEquals(ctx.compress, "gzip");
    assertEquals(ctx.cacheControl, "no-cache");
    assertEquals(ctx.hasMetrics, true);
  } finally {
    s.close();
  }
});

Deno.test("e2e: app routes with DENO_DEPLOYMENT_ID via subprocess", async () => {
  const p = new Deno.Command(Deno.execPath(), {
    args: ["run", "-A", "--coverage=coverage", "modules/app.ts"],
    env: { "DENO_DEPLOYMENT_ID": "test-deployment" },
    stdout: "piped",
    stderr: "piped",
  });

  const output = await p.output();
  const errStr = new TextDecoder().decode(output.stderr);

  assertEquals(output.code, 0, `Process exited with ${output.code}\n${errStr}`);
});
