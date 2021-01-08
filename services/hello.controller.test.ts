import { Fastro } from "../mod.ts";
import { assertEquals } from "../deps.ts";

Deno.env.set("DENO_ENV", "test");

Deno.test({
  name: "HELLO",
  fn() {
    const port = 3000;
    const base = `http://localhost:${port}`;
    const s = new Fastro({ port });
    setTimeout(async () => {
      const h = await fetch(`${base}/hello`);
      const t = await h.text();
      assertEquals(t, "setup complete");
      s.close();
    }, 4000);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
