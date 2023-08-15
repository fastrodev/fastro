import { assertEquals } from "https://deno.land/std@0.198.0/assert/assert_equals.ts";
import { assertExists } from "https://deno.land/std@0.198.0/assert/assert_exists.ts";
import fastro, { Fastro, Info } from "../mod.ts";
import { assert } from "https://deno.land/std@0.198.0/assert/assert.ts";

const host = "http://localhost:8000";

Deno.test(
  { permissions: { net: true, env: true, read: true, write: true } },
  async function getResponses() {
    const f = new fastro();
    f.hook((_f: Fastro, r: Request, _i: Info) => {
      if (r.url === "hook") return new Response("hook");
      return new Response();
    });
    f.get("/", () => new Response("get"));
    f.post("/", () => new Response("post"));
    f.put("/", () => new Response("put"));
    f.delete("/", () => new Response("delete"));
    f.options("/", () => new Response("options"));
    f.head("/", () => new Response(""));
    f.get("/hook", () => new Response("hook"));
    f.serve();

    const get = await fetch(host, { method: "GET" });
    assert(await get.text(), "get");

    const post = await fetch(host, { method: "POST" });
    assert(await post.text(), "post");

    const put = await fetch(host, { method: "PUT" });
    assert(await put.text(), "put");

    const del = await fetch(host, { method: "DELETE" });
    assert(await del.text(), "delete");

    const ops = await fetch(host, { method: "OPTIONS" });
    assert(await ops.text(), "options");

    const head = await fetch(host, { method: "HEAD" });
    assertEquals(await head.text(), "");

    const hook = await fetch(host + "/hook", { method: "GET" });
    assertEquals(await hook.text(), "hook");

    f.close();
    await f.finished();
  },
);

Deno.test(
  { permissions: { net: true, env: true, read: true, write: true } },
  async function getStaticFileWithStaticPath() {
    const f = new fastro();
    f.static("/static", { folder: "static", maxAge: 90 });
    f.serve();
    const get = await fetch(`${host}/static/post.css`, { method: "GET" });
    assertExists(await get.text(), `@media (min-width: 576px)`);
    f.close();
    await f.finished();
  },
);

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
