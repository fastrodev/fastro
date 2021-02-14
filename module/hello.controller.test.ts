import { Fastro } from "../mod.ts";
import { assertEquals } from "../deps.ts";
import { TIMEOUT } from "../core/constant.ts";

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
    }, TIMEOUT);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
