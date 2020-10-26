import { Fastro } from "../mod.ts";
import { assertStringContains } from "../deps.ts";

const { test } = Deno;
const port = 3010;
const base = `http://localhost:${port}`;
const server = new Fastro();

Deno.env.set("DENO_ENV", "test");

test({
  name: "STATIC FILE",
  async fn() {
    server.listen({ port });
    const result = await fetch(`${base}/readme.md`);
    const text = await result.text();
    assertStringContains(text, "# Static File");
    server.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
