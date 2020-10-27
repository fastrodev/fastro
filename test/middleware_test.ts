import { Fastro } from "../mod.ts";
import { assertStringIncludes } from "../deps.ts";

const { test } = Deno;
const port = 3012;
const base = `http://localhost:${port}`;
const server = new Fastro();

Deno.env.set("DENO_ENV", "test");

test({
  name: "MIDDLEWARE",
  async fn() {
    server.listen({ port });
    const result = await fetch(`${base}/middleware`);
    const text = await result.text();
    assertStringIncludes(text, "middleware");
    server.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
