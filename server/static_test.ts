import Hello from "../pages/hello.tsx";
import { HttpRequest, HttpResponse } from "../types.d.ts";
import { assertEquals, assertExists } from "./deps.ts";
import { createSSR } from "./render.ts";
import { fastro } from "./server.ts";

const host = "http://127.0.0.1:9000";

Deno.test({
  name: "index html",
  fn: async () => {
    const f = fastro();
    f.flash(false);
    f.static("/");
    const s = f.serve();
    let r = await fetch(host, { method: "GET" });
    r = await fetch(host, { method: "GET" });
    assertEquals((await r.text()).trim(), `<h1>ok</h1>`);
    await Deno.remove("./index.html");
    f.close();
    await s;
  },

  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "INDEX.HTML NOT FOUND",
  fn: async () => {
    const f = fastro();
    f.flash(false);
    f.static("/");
    const s = f.serve();
    await fetch(host, { method: "GET" });
    f.close();
    await s;
  },

  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "INDEX.HTML NOT FOUND",
  fn: async () => {
    const f = fastro();
    f.flash(false);
    f.static("/");
    const s = f.serve();
    let r = await fetch(host, { method: "GET" });
    r = await fetch(host, { method: "GET" });
    assertExists(await r.text(), "Not found");
    f.close();
    await s;
  },

  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "JPEG not found",
  fn: async () => {
    const f = fastro();
    f.flash(false);
    f.static("/");
    const s = f.serve();
    const r = await fetch(host + "/index.jpg", { method: "GET" });
    assertExists(await r.text(), "Not found");
    f.close();
    await s;
  },

  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "static",
  fn: async () => {
    const f = fastro();
    f.flash(false);
    f.static("/");
    const s = f.serve();
    const response = await fetch(host + "/public/hello.js", { method: "GET" });
    const r = await response.text();
    assertExists(r, "scheduler.production.min.js");
    f.close();
    await s;
  },

  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "markdown",
  fn: async () => {
    const f = fastro();
    f.flash(false);
    f.static("/");
    const server = f.serve();

    let response = await fetch(host + "/bench/result.md", { method: "GET" });
    let r = await response.text();
    assertExists(r, "module");

    response = await fetch(host + "/.gitignore", { method: "GET" });
    r = await response.text();
    assertExists(r, "fastro/pages/hello.tsx");

    f.close();
    await server;
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
    f.flash(false);
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
  name: "JPEG EXIST",
  fn: async () => {
    const f = fastro();
    f.flash(false);
    f.static("/");
    const s = f.serve();
    const r = await fetch(host + "/ok.jpg", { method: "GET" });
    assertExists(await r.text(), "jpg");
    await fetch(host + "/ok.x", { method: "GET" });
    f.close();
    await s;
  },

  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "JPEG Not Found",
  fn: async () => {
    const f = fastro();
    f.flash(false);
    f.static("/public");
    const s = f.serve();
    const r = await fetch(host + "/ok.jpg", { method: "GET" });
    assertEquals(await r.text(), "Not Found");

    f.close();
    await s;
  },

  sanitizeResources: false,
  sanitizeOps: false,
});
