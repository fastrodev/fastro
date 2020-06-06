const { test } = Deno;
import { assertEquals } from "../deps.ts";
import { Fastro } from "../mod.ts";
const addr = "http://localhost:8000";
const port = 8000;

test({
  name: "GET",
  async fn() {
    const server = new Fastro();
    server.route({
      method: "GET",
      url: "/",
      handler(req) {
        req.respond({ body: "hello" });
      },
    });
    server.listen({ port });
    const result = await fetch(addr);
    const text = await result.text();
    assertEquals(text, "hello");
    server.close();
  },
});

test({
  name: "POST",
  async fn() {
    const server = new Fastro();
    server.route({
      method: "POST",
      url: "/",
      async handler(req) {
        const payload = req.payload;
        req.respond({ body: payload });
      },
    });
    server.listen({ port });
    const result = await fetch(addr, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ msg: "hello" }),
    });
    const text = await result.text();
    assertEquals(text, '{"msg":"hello"}');
    server.close();
  },
});

test({
  name: "GET user",
  async fn() {
    const server = new Fastro();
    server.route({
      method: "GET",
      url: "/login/user/:name",
      handler(req) {
        req.respond({ body: `hello, ${req.parameter.name}` });
      },
    });
    server.listen({ port });
    const result = await fetch(addr + "/login/user/agus");
    const text = await result.text();
    assertEquals(text, "hello, agus");
    server.close();
  },
});

test({
  name: "MIDDLEWARE",
  async fn() {
    const server = new Fastro();
    server.use((req, done) => {
      req.sendOk = (payload: string) => {
        req.send(payload);
      };
      done();
    });
    server.get("/", (req) => req.sendOk("plugin"));
    server.listen({ port });
    const result = await fetch(addr);
    const text = await result.text();
    assertEquals(text, "plugin");
    server.close();
  },
});

test({
  name: "MIDDLEWARE with url",
  async fn() {
    const server = new Fastro();
    server
      .use("/ok", (req, done) => {
        req.sendOk = (payload: string) => {
          req.send(payload);
        };
        done();
      })
      .get("/ok", (req) => {
        req.sendOk("MIDDLEWARE");
      });
    server.listen({ port });
    const result = await fetch(addr + "/ok");
    const text = await result.text();
    assertEquals(text, "MIDDLEWARE");
    server.close();
  },
});

test({
  name: "DECORATE instance",
  async fn() {
    const server = new Fastro();
    server.decorate((instance) => {
      instance.ok = "ok";
    });
    assertEquals(server.ok, "ok");
  },
});

test({
  name: "DECORATE request",
  async fn() {
    const server = new Fastro();
    server
      .decorateRequest((req) => {
        req.ok = "ok";
      })
      .get("/", (req) => req.send(req.ok));
    server.listen({ port });
    const result = await fetch(addr);
    const text = await result.text();
    assertEquals(text, "ok");
    server.close();
  },
});

test({
  name: "PLUGIN",
  async fn() {
    const server = new Fastro();
    server
      .register((fastro) => {
        fastro.get("/ok", (req) => {
          req.send("PLUGIN");
        });
      });
    server.listen({ port });
    const result = await fetch(addr + "/ok");
    const text = await result.text();
    assertEquals(text, "PLUGIN");
    server.close();
  },
});

test({
  name: "PLUGIN with prefix",
  async fn() {
    const server = new Fastro();
    server
      .register("v1", (fastro, done) => {
        fastro.get("/ok", (req) => {
          req.send("PLUGIN");
        });
        done();
      });
    server.listen({ port });
    const result = await fetch(addr + "/v1/ok");
    const text = await result.text();
    assertEquals(text, "PLUGIN");
    server.close();
  },
});
