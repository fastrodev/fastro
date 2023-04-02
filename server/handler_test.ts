import { assertEquals } from "./deps.ts";
import { fastro } from "./server.ts";

const host = "http://127.0.0.1:9000";

Deno.test({ permissions: { net: true } }, async function getMethod2() {
  const app = fastro();
  app.flash(false);
  app.get("/", () => new Response("GET"));
  app.post("/", () => "hello");
  app.delete("/", () => ({ txt: "hello" }));
  app.put("/", () => []);
  app.patch("/", () => undefined);
  app.set("key", {});

  const server = app.serve({
    onError: (err) => new Response(<string> err),
    onListen: (val) => console.log(val.hostname),
  });

  assertEquals(app.container.get("key"), {});

  let response = await fetch(host, { method: "GET" });
  assertEquals(await response.text(), "GET");

  response = await fetch(host, { method: "GET" });
  assertEquals(await response.text(), "GET");

  response = await fetch(host, { method: "POST" });
  assertEquals(await response.text(), "hello");

  response = await fetch(host, { method: "DELETE" });
  assertEquals(await response.text(), '{"txt":"hello"}');

  response = await fetch(host, { method: "PATCH" });
  assertEquals(
    await response.text(),
    `TypeError: Cannot read properties of undefined (reading 'props')`,
  );

  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function getMethod3() {
  const app = fastro();
  app.get("/", () => new Response("GET"));
  app.post("/", () => "hello");
  app.delete("/", () => ({ txt: "hello" }));
  app.put("/", () => []);

  app.set("key", {});

  const server = app.serve({
    onError: (err) => new Response(<string> err),
    onListen: (val) => console.log(val.hostname),
  });

  assertEquals(app.container.get("key"), {});

  let response = await fetch(host, { method: "GET" });
  assertEquals(await response.text(), "GET");

  response = await fetch(host, { method: "GET" });
  assertEquals(await response.text(), "GET");

  response = await fetch(host, { method: "POST" });
  assertEquals(await response.text(), "hello");

  response = await fetch(host, { method: "DELETE" });
  assertEquals(await response.text(), '{"txt":"hello"}');

  app.close();
  await server;
});
