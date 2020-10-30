import { Fastro } from "../mod.ts";
import { assertStringIncludes } from "../deps.ts";

const { test } = Deno;
const port = 3011;
const base = `http://localhost:${port}`;
const server = new Fastro({ port });

Deno.env.set("DENO_ENV", "test");

test({
  name: "VIEW",
  async fn() {
    const result = await fetch(`${base}/hello/v3/hello`);
    const text = await result.text();
    assertStringIncludes(text, "<html>");
    server.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
