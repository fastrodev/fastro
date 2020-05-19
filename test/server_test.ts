const { test } = Deno;
import { assertEquals } from "../dev_deps.ts";
import { Fastro } from "../mod.ts";
const addr = "http://localhost:8000";

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
    server.listen();
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
    server.listen();
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
    server.listen();
    const result = await fetch(addr + "/login/user/agus");
    const text = await result.text();
    assertEquals(text, "hello, agus");
    server.close();
  },
});
