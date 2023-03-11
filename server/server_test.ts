import Hello from "../pages/hello.tsx";
import { assertEquals, assertExists, Status, STATUS_TEXT } from "./deps.ts";
import { fastro } from "./server.ts";
import { createSSR } from "./ssr.ts";
import { HttpRequest, HttpResponse, Next } from "./types.ts";

const host = "http://localhost:9000";

Deno.test({ permissions: { net: true } }, async function getMethod() {
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
  app.flash(false);
  app.options("/", () => new Response("OPTIONS"));
  const server = app.serve({
    port: 9000,
    onError: (err) => new Response(<string> err),
  });
  const response = await fetch(host, { method: "OPTIONS" });
  assertEquals(await response.text(), "OPTIONS");
  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function headMethod() {
  const app = fastro();
  app.head("/", () => new Response("HEAD"));
  const server = app.serve();
  const response = await fetch(host, { method: "HEAD" });
  assertEquals(await response.text(), "");
  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function middleware() {
  const app = fastro();
  app.get(
    "/",
    (_req: HttpRequest, _res: HttpResponse, next: Next) => {
      next();
    },
    (_req: HttpRequest, _res: HttpResponse, next: Next) => {
      next("error");
    },
    (_req: HttpRequest, res: HttpResponse, _next: Next) => res.send("GET"),
    () => "Hello world",
  );
  app.use(
    (_req, _res, next) => {
      next("error");
    },
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

  let response = await fetch(host, { method: "POST" });
  let r = await response.text();
  assertEquals(r, `{"status":403,"text":"Forbidden"}`);

  response = await fetch(host, { method: "GET" });
  r = await response.text();
  assertEquals(r, `GET`);

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

Deno.test({
  name: "static",
  fn: async () => {
    const f = fastro();
    f.static("/");
    f.serve();
    const response = await fetch(host + "/public/hello.js", { method: "GET" });
    const r = await response.text();
    assertEquals(r, "Not Found");
    f.close();
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  },

  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "page",
  fn: async () => {
    const f = fastro();
    const hello = createSSR(Hello);

    f.build(true);
    f.flash(true);
    f.static("/public", 5)
      .page("/", hello, (_req: HttpRequest, res: HttpResponse) => {
        return res.ssr(hello)
          .title(`Hello`)
          .render();
      });

    const server = f.serve();

    let response = await fetch(host, { method: "GET" });
    let r = await response.text();
    assertExists(r, "Hello");

    response = await fetch(host, { method: "GET" });
    r = await response.text();
    assertExists(r, "Hello");

    response = await fetch(host + "/public/hello.js", { method: "GET" });
    r = await response.text();
    assertExists(r, "@license Reactllo");

    response = await fetch(host + "/public/hello.js", { method: "GET" });
    r = await response.text();
    assertExists(r, "@license Reactllo");

    const notfoundres = await fetch(host + "/public/notfound.js", {
      method: "GET",
    });
    const notfound = await notfoundres.text();
    assertExists(notfound, "Not Found");

    f.close();
    await server;
  },

  sanitizeResources: false,
  sanitizeOps: false,
});
