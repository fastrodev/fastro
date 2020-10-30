import { Fastro } from "../mod.ts";
import { assertStringIncludes } from "../deps.ts";

const { test } = Deno;
const port = 3010;
const base = `http://localhost:${port}`;
const server = new Fastro({ port });

Deno.env.set("DENO_ENV", "test");

test({
  name: "STATIC FILE",
  async fn() {
    const result = await fetch(`${base}/readme.md`);
    const text = await result.text();
    assertStringIncludes(text, "# Static File");
    server.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
