import { Fastro } from "../mod.ts";
import { assertStringIncludes } from "../deps.ts";
import { TIMEOUT } from "../core/constant.ts";

Deno.env.set("DENO_ENV", "test");

Deno.test({
  name: "PROXY",
  fn() {
    const port = 3003;
    const base = `http://localhost:${port}`;
    const f = new Fastro({ port });
    setTimeout(async () => {
      const h = await fetch(`${base}/proxy`);
      const t = await h.text();
      assertStringIncludes(
        t,
        `# Fastro\n`,
      );
      f.close();
    }, TIMEOUT);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
