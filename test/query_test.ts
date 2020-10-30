import { Fastro } from "../mod.ts";
import { assertEquals } from "../deps.ts";

const { test } = Deno;
const port = 3004;
const base = `http://localhost:${port}`;
const server = new Fastro({ port });

Deno.env.set("DENO_ENV", "test");

test({
  name: "URL QUERY",
  async fn() {
    const result = await fetch(
      `${base}/hello/v1/queryall?name=pram&address=cirebon`,
    );
    const txt = await result.text();
    const query = JSON.parse(txt);
    assertEquals(query, { "name": "pram", "address": "cirebon" });
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

test({
  name: "URL QUERY BY NAME",
  async fn() {
    const result = await fetch(
      `${base}/hello/v1/querybyname?name=pram&address=cirebon`,
    );
    const txt = await result.text();
    const query = JSON.parse(txt);
    assertEquals(query, { "name": "pram" });
    server.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
