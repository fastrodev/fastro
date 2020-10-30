import { Fastro } from "../mod.ts";
import { assertEquals } from "../deps.ts";

const { test } = Deno;
const port = 3007;
const base = `http://localhost:${port}`;
const server = new Fastro({ port });

Deno.env.set("DENO_ENV", "test");

test({
  name: "PREFIX ON FILE",
  async fn() {
    const result = await fetch(`${base}/api/hello/v1/prefix`);
    const text = await result.text();
    assertEquals(text, "prefix");
    server.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
