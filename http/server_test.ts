import fastro from "../mod.ts";
import { assertEquals, assertExists } from "./deps.ts";

const host = "http://localhost:8000";

Deno.test(
  { permissions: { net: true, env: true, read: true, write: true } },
  async function getResponses() {
    const f = new fastro();
    f.get("/", () => new Response("get"));
    f.post("/", () => new Response("post"));
    f.put("/", () => new Response("put"));
    f.delete("/", () => new Response("delete"));
    f.options("/", () => new Response("options"));
    f.head("/", () => new Response(""));
    f.serve();

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

    const head = await fetch(host, { method: "HEAD" });
    assertEquals(await head.text(), "");

    f.close();
    await f.finished();
  },
);

// Deno.test(
//   { permissions: { net: true, env: true, read: true, write: true } },
//   async function getStaticFileWithStaticPath() {
//     const f = new fastro();
//     f.hook(() => new Response("hook"));
//     f.serve();
//     const get = await fetch(host, { method: "GET" });
//     assertEquals(await get.text(), "hook");
//     f.close();
//     await f.finished();
//   },
// );

// Deno.test(
//   { permissions: { net: true, env: true, read: true, write: true } },
//   async function getStaticFileWithStaticPath() {
//     const f = new fastro();
//     f.static("/static", { folder: "static", maxAge: 90 });
//     f.serve();
//     const get = await fetch(`${host}/static/post.css`, { method: "GET" });
//     assertExists(await get.text(), `@media (min-width: 576px)`);
//     f.close();
//     await f.finished();
//   },
// );

Deno.test(
  { permissions: { net: true, env: true, read: true, write: true } },
  async function getStaticFileWithRootPath() {
    const f = new fastro();
    f.static("/", { folder: "static", maxAge: 90 });
    f.serve();
    const get = await fetch(`${host}/static/post.css`, { method: "GET" });
    assertExists(await get.text(), `@media (min-width: 576px)`);
    f.close();
    await f.finished();
  },
);
