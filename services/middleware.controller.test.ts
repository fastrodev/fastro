import { Fastro } from "../mod.ts";
import { assertEquals } from "../deps.ts";

Deno.env.set("DENO_ENV", "test");

Deno.test({
  name: "MIDDLEWARE",
  fn() {
    const port = 3001;
    const base = `http://localhost:${port}`;
    const s = new Fastro({ port });
    setTimeout(async () => {
      const h = await fetch(`${base}/middleware`);
      const t = await h.text();
      assertEquals(t, "middleware");
      s.close();
    }, 4000);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
