import { Fastro } from "../mod.ts";
import { assertEquals } from "../deps.ts";

const { test } = Deno;
const port = 3003;
const base = `http://localhost:${port}`;
const server = new Fastro();

test({
  name: "DYNAMIC URL PARAMS",
  async fn() {
    server.listen({ port });
    const result = await fetch(`${base}/hello/v1/params/oke`);
    const txt = await result.text();
    const params = JSON.parse(txt);
    assertEquals(params, ["hello", "v1", "params", "oke"]);
    server.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
