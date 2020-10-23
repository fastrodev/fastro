import { Fastro } from "../mod.ts";
import { assertStringContains } from "../deps.ts";

const { test } = Deno;
const port = 4000;
const base = `http://localhost:${port}`;
const server = new Fastro();

Deno.env.set("DENO_ENV", "test");

test({
  name: "VIEW",
  fn() {
    server.listen({ port });
    setTimeout(async () => {
      const result = await fetch(`${base}/hello/v3/hello`);
      const text = await result.text();
      assertStringContains(text, "<html>");
      server.close();
    }, 1000);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
