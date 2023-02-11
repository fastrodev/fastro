import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { fastro } from "./server.ts";

const host = "http://localhost:9000";

// Deno.test({ permissions: { net: true } }, async function getMethodWithFlash() {
//   const app = fastro({ flash: true });
//   app.get("/", () => new Response("GET"));
//   const server = app.serve();
//   const response = await fetch(host, { method: "GET" });
//   assertEquals(await response.text(), "GET");
//   app.close();
//   await server;
// });

Deno.test({ permissions: { net: true } }, async function getMethod() {
  const app = fastro();
  app.get("/", () => new Response("GET"));
  const server = app.serve();
  const response = await fetch(host, { method: "GET" });
  assertEquals(await response.text(), "GET");
  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function postMethod() {
  const app = fastro();
  app.post("/", () => new Response("POST"));
  const server = app.serve();
  const response = await fetch(host, { method: "POST" });
  assertEquals(await response.text(), "POST");
  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function putMethod() {
  const app = fastro();
  app.put("/", () => new Response("PUT"));
  const server = app.serve();
  const response = await fetch(host, { method: "PUT" });
  assertEquals(await response.text(), "PUT");
  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function deleteMethod() {
  const app = fastro();
  app.delete("/", () => new Response("DELETE"));
  const server = app.serve();
  const response = await fetch(host, { method: "DELETE" });
  assertEquals(await response.text(), "DELETE");
  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function patchMethod() {
  const app = fastro();
  app.patch("/", () => new Response("PATCH"));
  const server = app.serve();
  const response = await fetch(host, { method: "PATCH" });
  assertEquals(await response.text(), "PATCH");
  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function optionsMethod() {
  const app = fastro();
  app.options("/", () => new Response("OPTIONS"));
  const server = app.serve();
  const response = await fetch(host, { method: "OPTIONS" });
  assertEquals(await response.text(), "OPTIONS");
  app.close();
  await server;
});
