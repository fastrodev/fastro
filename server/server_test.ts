import Hello from "../pages/hello.tsx";
import {
  assertEquals,
  assertExists,
  Cookie,
  Status,
  STATUS_TEXT,
} from "./deps.ts";
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

Deno.test({ permissions: { net: true } }, async function getMethod() {
  const app = fastro();
  app.get("/", (req: HttpRequest, res: HttpResponse) => {
    req.set("key1", "key1");
    req.get("key1");
    req.delete("key1");
    req.container();
    const cookie: Cookie = { name: "Space", value: "Cat" };

    const headers = new Headers();
    headers.set("x", "x");
    res.headers(headers);
    res.authorization("token");
    res.contentType("text/html; charset=utf-8");

    return res.setCookie(cookie).html("<div>Hello</div>");
  });

  const server = app.serve();

  const response = await fetch(host, { method: "GET" });

  const cookie = response.headers.get("Set-Cookie");

  const x = response.headers.get("x");

  assertEquals(cookie, "Space=Cat");
  assertEquals(x, "x");
  assertEquals(await response.text(), "<div>Hello</div>");

  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function getJson() {
  const app = fastro();
  app.get("/", (_req: HttpRequest, res: HttpResponse) => {
    return res.json({ txt: "hello" });
  });

  const server = app.serve();

  const response = await fetch(host, { method: "GET" });
  const r = await response.text();
  assertEquals(r, '{"txt":"hello"}');
  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function getMethod() {
  const app = fastro();
  app.get("/", (_req: HttpRequest, res: HttpResponse) => {
    const cookie: Cookie = { name: "Space", value: "Cat" };
    res.setCookie(cookie);
    res.deleteCookie("Space");
    return res.setCookie(cookie).html("<div>Hello</div>");
  });

  const server = app.serve();

  const response = await fetch(host, { method: "GET" });

  const cookie = response.headers.get("Set-Cookie");
  console.log(cookie);

  assertEquals(
    cookie,
    "Space=; Expires=Thu, 01 Jan 1970 00:00:00 GMT, Space=Cat",
  );
  assertEquals(await response.text(), "<div>Hello</div>");

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
      next();
    },
    (_req: HttpRequest, res: HttpResponse, _next: Next) => res.send("GET"),
    () => "Hello world",
  );
  app.use(
    (_req, _res, next) => {
      next();
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

Deno.test({ permissions: { net: true } }, async function middleware() {
  const app = fastro();
  app.flash(false);
  app.get(
    "/",
    (_req: HttpRequest, _res: HttpResponse, next: Next) => {
      next(new Error("error"));
    },
    () => "Hello world",
  );

  const server = app.serve();

  const response = await fetch(host, { method: "GET" });
  const r = await response.text();
  assertEquals(r, `error`);

  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function middleware() {
  const app = fastro();
  app.flash(false);
  app.use((_req: HttpRequest, _res: HttpResponse, next: Next) => {
    next(new Error("error"));
  });

  const server = app.serve();

  const response = await fetch(host, { method: "GET" });
  const r = await response.text();
  assertEquals(r, `error`);
  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function params() {
  const app = fastro();
  app.get("/:user", (req: HttpRequest, res: HttpResponse) => {
    return res.json({ user: req.param("user"), title: req.query("title") });
  });
  const server = app.serve();
  const response = await fetch(`${host}/agus?title=lead`, { method: "GET" });
  const r = await response.text();
  assertEquals(r, `{"user":"agus","title":"lead"}`);
  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function params() {
  const app = fastro();
  app.get("/:user", (req: HttpRequest, res: HttpResponse) => {
    return res.json({ user: req.params(), title: req.queries() });
  });
  const server = app.serve();
  const response = await fetch(`${host}/agus?title=lead`, { method: "GET" });
  const r = await response.text();
  console.log("r", r);
  assertEquals(r, `{"user":{"user":"agus"},"title":["lead"]}`);
  app.close();
  await server;
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

Deno.test({
  name: "static",
  fn: async () => {
    const f = fastro();
    f.static("/");
    f.serve();
    const response = await fetch(host + "/public/hello.js", { method: "GET" });
    const r = await response.text();
    assertExists(r, "scheduler.production.min.js");
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
  name: "markdown",
  fn: async () => {
    const f = fastro();
    f.static("/");
    f.serve();

    let response = await fetch(host + "/bench/result.md", { method: "GET" });
    let r = await response.text();
    assertExists(r, "module");

    response = await fetch(host + "/.gitignore", { method: "GET" });
    r = await response.text();
    assertExists(r, "fastro/pages/hello.tsx");

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
