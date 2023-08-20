import { assertEquals } from "https://deno.land/std@0.198.0/assert/assert_equals.ts";
import { assertExists } from "https://deno.land/std@0.198.0/assert/assert_exists.ts";
import fastro, { Fastro, Info } from "../mod.ts";
import { assert } from "https://deno.land/std@0.198.0/assert/assert.ts";
import { Context, HttpRequest, Next } from "./server.ts";
import User from "../pages/user.tsx";

interface Deferred<T> extends Promise<T> {
  readonly state: "pending" | "fulfilled" | "rejected";
  resolve(value?: T | PromiseLike<T>): void;
  // deno-lint-ignore no-explicit-any
  reject(reason?: any): void;
}

function deferred<T>(): Deferred<T> {
  let methods;
  let state = "pending";
  const promise = new Promise<T>((resolve, reject) => {
    methods = {
      async resolve(value: T | PromiseLike<T>) {
        await value;
        state = "fulfilled";
        resolve(value);
      },
      // deno-lint-ignore no-explicit-any
      reject(reason?: any) {
        state = "rejected";
        reject(reason);
      },
    };
  });
  Object.defineProperty(promise, "state", { get: () => state });
  return Object.assign(promise, methods) as Deferred<T>;
}

const host = "http://localhost:8000";

Deno.test(
  {
    permissions: { net: true, env: true, read: true, write: true },
    name: "getResponses",
    async fn() {
      const f = new fastro();

      f.hook((_f: Fastro, r: Request, _i: Info) => {
        if (r.url === "hook") return new Response("hook");
        return new Response();
      });
      f.static("/", { folder: "static", maxAge: 90 });
      f.get("/", () => new Response("get"));
      f.post("/", () => new Response("post"));
      f.put("/", () => new Response("put"));
      f.delete("/", () => new Response("delete"));
      f.options("/", () => new Response("options"));
      f.head("/", () => new Response(""));
      f.get("/hook", () => new Response("hook"));
      f.get("/tsx", () => <>TSX</>);
      f.get("/json", () => ({ value: "foo" }));
      f.get("/txt", () => "txt");
      f.page("/page", <>Page</>, (req: HttpRequest, ctx: Context) => {
        return ctx.render();
      });

      f.get(
        "/middleware",
        () => new Response("middleware"),
        () => "txt",
      );

      f.use((req: HttpRequest, ctx: Context, next: Next) => {
        if (req.url === "http://localhost:8000/middleware2") {
          return new Response("middleware2");
        }
        return next();
      });

      await f.serve();

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

      const tsx = await fetch(host + "/tsx", { method: "GET" });
      assertEquals(await tsx.text(), "TSX");

      const json = await fetch(host + "/json", { method: "GET" });
      assertEquals(await json.text(), `{"value":"foo"}`);

      const txt = await fetch(host + "/txt", { method: "GET" });
      assertEquals(await txt.text(), `txt`);

      const mid = await fetch(host + "/middleware", { method: "GET" });
      assertEquals(await mid.text(), `middleware`);

      const mid2 = await fetch(host + "/middleware2", { method: "GET" });
      assertEquals(await mid2.text(), `middleware2`);

      const statik = await fetch(`${host}/static/post.css`, { method: "GET" });
      assertExists(await statik.text(), `@media (min-width: 576px)`);

      const page = await fetch(host + "/page", { method: "GET" });
      assertEquals(
        await page.text(),
        `<!DOCTYPE html><html><head></head><body><div id="root" data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">Page</div></body></html>`,
      );

      f.close();
      await f.finished();
    },
  },
);

Deno.test(
  {
    permissions: { net: true, env: true, read: true, write: true },
    name: "getStaticFileWithStaticPath",
    sanitizeResources: false,
    sanitizeOps: false,
    async fn() {
      const f = new fastro();
      f.static("/static", { folder: "static", maxAge: 90 });
      await f.serve();
      const get = await fetch(`${host}/static/post.css`, { method: "GET" });
      assertExists(await get.text(), `@media (min-width: 576px)`);
      f.close();
      await f.finished();
    },
  },
);

Deno.test(
  {
    permissions: { net: true, env: true, read: true, write: true, run: true },
    name: "SSR",
    async fn() {
      const f = new fastro();

      f.page("/ssr", User, (req: HttpRequest, ctx: Context) => {
        return ctx.render();
      });

      await f.serve();

      const page2 = await fetch(host + "/ssr", { method: "GET" });
      assertExists(
        await page2.text(),
        `<h1>Hello </h1>`,
      );

      f.close();
      await f.finished();
    },
    sanitizeResources: false,
    sanitizeOps: false,
    sanitizeExit: false,
  },
);
