import { assertEquals } from "std/assert/assert_equals.ts";
import { assertExists } from "std/assert/assert_exists.ts";
import fastro from "../../mod.ts";
import { assert } from "std/assert/assert.ts";
import hello from "../../app/hello.page.tsx";
import dear from "../../app/dear.page.tsx";
import { layout } from "../../app/app.layout.tsx";
import { Fastro } from "./types.ts";

const host = "http://localhost:8000";

Deno.test(
  {
    permissions: { net: true, env: true, read: true, write: true },
    name: "rest handler",
    async fn() {
      const f = new fastro();
      f.static("/static", { folder: "static", maxAge: 90 });
      f.get("/", () => new Response("get"));
      f.post("/", () => new Response("post"));
      f.put("/", () => new Response("put"));
      f.delete("/", () => new Response("delete"));
      f.options("/", () => new Response("options"));
      f.patch("/", () => new Response("patch"));
      f.head("/", () => new Response(""));
      f.use((req, ctx) => {
        req.oke = "oke";
        return ctx.next();
      });
      f.group((f: Fastro) => {
        return f.get("/group", (req, ctx) => {
          return ctx.send("group");
        });
      });
      f.get("/string", (req, ctx) => {
        return ctx.send("string");
      });
      f.get("/json", (req, ctx) => {
        return ctx.send({ ok: true });
      });
      f.get("/array", (req, ctx) => {
        return ctx.send([{ ok: true }]);
      });

      f.get("/num", (req, ctx) => {
        return ctx.send(1);
      });
      f.get("/m", (req, ctx) => {
        console.log("oke", req.oke);
        return ctx.send({ data: req.oke, message: req.hello });
      }, (req, ctx) => {
        req.hello = "hello";
        return ctx.next();
      });

      f.get("/m2", (req, ctx) => {
        if (ctx.url.pathname === "/m2") {
          return new Response("m2");
        }
        return ctx.next();
      });

      f.get("/error", () => {
        throw new Error("error");
      });

      await f.serve();

      const m = await fetch(host + "/m", { method: "GET" });
      assertEquals(await m.text(), `{"data":"oke","message":"hello"}`);

      const m2 = await fetch(host + "/m2", { method: "GET" });
      assertEquals(await m2.text(), `m2`);

      const s = await fetch(host + "/static/favicon.ico", { method: "GET" });
      assertEquals(s.body instanceof ReadableStream, true);

      const str = await fetch(host + "/string", { method: "GET" });
      assertEquals(await str.text(), `string`);

      const json = await fetch(host + "/json", { method: "GET" });
      assertEquals(await json.text(), `{"ok":true}`);

      const arr = await fetch(host + "/array", { method: "GET" });
      assertEquals(await arr.text(), `[{"ok":true}]`);

      const num = await fetch(host + "/num", { method: "GET" });
      assertEquals(await num.text(), `1`);

      const grup = await fetch(host + "/group", { method: "GET" });
      assertEquals(await grup.text(), `group`);

      const get = await fetch(host, { method: "GET" });
      assertEquals(await get.text(), "get");

      const post = await fetch(host, { method: "POST" });
      assertEquals(await post.text(), "post");

      const put = await fetch(host, { method: "PUT" });
      assertEquals(await put.text(), "put");

      const del = await fetch(host, { method: "DELETE" });
      assertEquals(await del.text(), "delete");

      const ops = await fetch(host, { method: "OPTIONS" });
      assertEquals(await ops.text(), "options");

      const patch = await fetch(host, { method: "PATCH" });
      assertEquals(await patch.text(), "patch");

      const head = await fetch(host, { method: "HEAD" });
      assertEquals(await head.text(), "");

      const e = await fetch(host + "/error", { method: "GET" });
      assertExists(await e.text(), `Error: error\n`);

      const notFound = await fetch(host + "/not_found", { method: "GET" });
      assertExists(
        await notFound.text(),
        `Not Found`,
      );

      const notFound2 = await fetch(host + "/not_found", { method: "GET" });
      assertExists(
        await notFound2.text(),
        `Not Found`,
      );

      await f.shutdown();
    },
    sanitizeResources: false,
    sanitizeOps: false,
    sanitizeExit: false,
  },
);
