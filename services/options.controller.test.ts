import { Fastro } from "../mod.ts";
import { assertEquals } from "../deps.ts";

Deno.env.set("DENO_ENV", "test");

Deno.test({
  name: "SERVICE OPTIONS",
  fn() {
    const port = 3002;
    const base = `http://localhost:${port}`;
    const f = new Fastro({ port });
    setTimeout(async () => {
      const h = await fetch(`${base}/api/options?name=agus&address=cirebon`, {
        method: "POST",
        headers: {
          "token": "secret",
        },
        body: "post body",
      });
      const t = await h.text();
      assertEquals(
        t,
        `{"x":{"name":"agus","address":"cirebon"},"y":["api","options?name=agus&address=cirebon"],"z":"post body"}`,
      );
      f.close();
    }, 4000);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
