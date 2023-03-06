import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { Status, STATUS_TEXT } from "./deps.ts";
import { fastro } from "./server.ts";
import { HttpRequest, HttpResponse } from "./types.ts";

const host = "http://localhost:9000";

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

Deno.test({ permissions: { net: true } }, async function middleware() {
  const app = fastro();
  app.use(
    (req, res, next) => {
      if (req.method === "POST") {
        return res
          .status(Status.Forbidden)
          .json({
            status: Status.Forbidden,
            text: STATUS_TEXT[Status.Forbidden],
          });
      }
      next();
    },
  );
  const server = app.serve();
  const response = await fetch(host, { method: "POST" });
  const r = await response.text();
  assertEquals(r, `{"status":403,"text":"Forbidden"}`);
  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function params() {
  const app = fastro();
  app.get("/:user", (req: HttpRequest, res: HttpResponse) => {
    const r = req.match?.pathname.groups;
    if (!r) return res.send("not found");
    const { user } = r;
    return res.send(user);
  });
  const server = app.serve();
  const response = await fetch(`${host}/agus`, { method: "GET" });
  const r = await response.text();
  assertEquals(r, "agus");
  app.close();
  await server;
});
