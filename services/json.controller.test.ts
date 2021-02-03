import { TIMEOUT } from "../core/constant.ts";
import { assertEquals } from "../deps.ts";
import { Fastro } from "../mod.ts";

Deno.env.set("DENO_ENV", "test");

Deno.test({
  name: "JSON",
  fn() {
    const port = 3005;
    const base = `http://localhost:${port}`;
    const s = new Fastro({ port });
    setTimeout(async () => {
      const h = await fetch(`${base}/json`);
      const t = await h.text();
      assertEquals(t, '{"message":"hello"}');
      s.close();
    }, TIMEOUT);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
