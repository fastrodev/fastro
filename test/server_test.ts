import { Fastro } from "../mod.ts";
import { assertEquals } from "../deps.ts";

const { test } = Deno;
const port = 3000;
const base = `http://localhost:${port}`;

test({
  name: "GET",
  async fn() {
    const server = new Fastro();
    server.listen();
    const result = await fetch(`${base}/hello`);
    const text = await result.text();
    assertEquals(text, "hello");
    server.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

test({
  name: "PREFIX",
  async fn() {
    const server = new Fastro({ prefix: "api" });
    server.listen();
    const result = await fetch(`${base}/api/hello`);
    const text = await result.text();
    assertEquals(text, "hello");
    server.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

test({
  name: "SERVICE DIRECTORY",
  async fn() {
    const server = new Fastro({ serviceDir: "services/hello/v1" });
    server.listen({ port });
    const result = await fetch(`${base}/hello`);
    const text = await result.text();
    assertEquals(text, "hello v1");
    server.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

test({
  name: "SERVICE DIRECTORY 2",
  async fn() {
    const server = new Fastro({ serviceDir: "services/hello/v2" });
    server.listen({ port });
    const result = await fetch(`${base}/hello`);
    const text = await result.text();
    assertEquals(text, "hello v2");
    server.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
