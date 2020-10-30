import { Fastro } from "../mod.ts";
import { assertEquals } from "../deps.ts";

const { test } = Deno;
const port = 3001;
const base = `http://localhost:${port}`;
const server = new Fastro({ port });

Deno.env.set("DENO_ENV", "test");

test({
  name: "SET COOKIE",
  async fn() {
    const result = await fetch(`${base}/cookie/set`);
    const cookie = result.headers.get("set-cookie");
    assertEquals(cookie, "greeting=Hi;");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

test({
  name: "GET COOKIE",
  async fn() {
    const headers = new Headers();
    headers.set("cookie", "greeting=Hi");
    const result = await fetch(`${base}/cookie/get`, {
      headers: headers,
    });
    const txt = await result.text();
    assertEquals(txt, "Hi");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

test({
  name: "LIST ALL COOKIES",
  async fn() {
    const headers = new Headers();
    headers.set("cookie", "greeting=Hi;word=Hello");
    const result = await fetch(`${base}/cookie/cookies`, {
      headers: headers,
    });
    const txt = await result.text();
    const cookies = JSON.parse(txt);
    assertEquals(cookies, ["greeting=Hi", "word=Hello"]);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

test({
  name: "CLEAR COOKIE",
  async fn() {
    await fetch(`${base}/cookie/set`);
    const result = await fetch(`${base}/cookie/clear`);
    const cookie = result.headers.get("set-cookie");
    assertEquals(cookie, "greeting=;expires=Thu, 01 Jan 1970 00:00:00 GMT;");
    server.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
