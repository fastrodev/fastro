import { Fastro } from "../mod.ts";
import { assertEquals } from "../deps.ts";

const { test } = Deno;
const port = 3001;
const base = `http://localhost:${port}`;

Deno.env.set("DENO_ENV", "test");

test({
  name: "SERVICE DIRECTORY 2",
  async fn() {
    const server = new Fastro({ serviceDir: "services/hello/v2", port });
    const result = await fetch(`${base}/hello`);
    const text = await result.text();
    assertEquals(text, "hello v2");
    server.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
