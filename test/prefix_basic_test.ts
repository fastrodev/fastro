import { Fastro } from "../mod.ts";
import { assertEquals } from "../deps.ts";

const { test } = Deno;
const port = 3000;
const base = `http://localhost:${port}`;

Deno.env.set("DENO_ENV", "test");

test({
  name: "PREFIX",
  async fn() {
    const server = new Fastro({ prefix: "api" });
    const result = await fetch(`${base}/api/hello`);
    const text = await result.text();
    assertEquals(text, "setup complete");
    server.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
