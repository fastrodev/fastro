import { Fastro } from "../mod.ts";
import { assertEquals } from "../deps.ts";

const { test } = Deno;
const port = 3000;
const base = `http://localhost:${port}`;

Deno.env.set("DENO_ENV", "test");

test({
  name: "SERVICE DIRECTORY",
  async fn() {
    const server = new Fastro({ serviceDir: "services/hello/v1" });
    const result = await fetch(`${base}/hello`);
    const text = await result.text();
    assertEquals(text, "hello v1");
    server.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
