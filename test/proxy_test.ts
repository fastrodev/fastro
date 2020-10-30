import { Fastro } from "../mod.ts";
import { assertArrayContains } from "https://deno.land/std@0.73.0/testing/asserts.ts";

const { test } = Deno;
const port = 3008;
const base = `http://localhost:${port}`;
const server = new Fastro({ port });

Deno.env.set("DENO_ENV", "test");

test({
  name: "PROXY",
  async fn() {
    const result = await fetch(`${base}/proxy`);
    const text = await result.text();
    assertArrayContains(text, "Fast and simple web framework");
    server.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
