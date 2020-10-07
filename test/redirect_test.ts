import { Fastro } from "../mod.ts";
import { assertEquals } from "../deps.ts";

const { test } = Deno;
const port = 3006;
const base = `http://localhost:${port}`;
const server = new Fastro();

Deno.env.set("DENO_ENV", "test");

test({
  name: "REDIRECT",
  async fn() {
    server.listen({ port });
    const result = await fetch(`${base}/hello/v1/redirect`);
    const txt = await result.text();
    assertEquals(txt, "setup complete");
    server.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
