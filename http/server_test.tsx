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
      f.get("/params/:id", (req: HttpRequest, ctx: Context) => {
        const id = req.params?.id;
        const v = req.query?.value;
        return ctx.send({ params: id, value: v });
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

      const params = await fetch(host + "/params/100?value=hello", {
        method: "GET",
      });
      assertEquals(await params.text(), `{"params":"100","value":"hello"}`);

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

      f.page("/props", User, (req: HttpRequest, ctx: Context) => {
        return ctx.render({ props: { data: "user" } });
      });

      f.page("/title", User, (req: HttpRequest, ctx: Context) => {
        return ctx.render({ html: { head: { title: "SSR Title" } } });
      });

      f.page("/desc", User, (req: HttpRequest, ctx: Context) => {
        return ctx.render({ html: { head: { descriptions: "SSR Desc" } } });
      });

      f.page("/script", User, (req: HttpRequest, ctx: Context) => {
        return ctx.render({
          html: { head: { script: [{ src: "script.js" }] } },
        });
      });

      f.page("/link", User, (req: HttpRequest, ctx: Context) => {
        return ctx.render({
          html: { head: { link: [{ href: "app.css" }] } },
        });
      });

      f.page("/head-style", User, (req: HttpRequest, ctx: Context) => {
        return ctx.render({
          html: { head: { headStyle: `body { color: #fff }` } },
        });
      });

      f.page("/head-script", User, (req: HttpRequest, ctx: Context) => {
        return ctx.render({
          html: { head: { headScript: `console.log('script')` } },
        });
      });

      f.page("/no-script", User, (req: HttpRequest, ctx: Context) => {
        return ctx.render({
          html: {
            head: { noScriptLink: { rel: "stylesheet", href: "app.jss" } },
          },
        });
      });

      await f.serve();

      const page1 = await fetch(host + "/ssr", { method: "GET" });
      assertExists(
        await page1.text(),
        `<h1>Hello </h1>`,
      );

      const props = await fetch(host + "/props", { method: "GET" });
      assertExists(
        await props.text(),
        `<h1>Hello user</h1>`,
      );

      const title = await fetch(host + "/title", { method: "GET" });
      assertExists(
        await title.text(),
        `<title>SSR Title</title>`,
      );

      const desc = await fetch(host + "/desc", { method: "GET" });
      assertExists(
        await desc.text(),
        `<meta name="description" content="SSR Desc"/>`,
      );

      const script = await fetch(host + "/script", { method: "GET" });
      assertExists(
        await script.text(),
        `<script src="script.js"></script>`,
      );

      const link = await fetch(host + "/link", { method: "GET" });
      assertExists(
        await link.text(),
        `<link href="app.css"/>`,
      );

      const headStyle = await fetch(host + "/head-style", { method: "GET" });
      assertExists(
        await headStyle.text(),
        `<style>body { color: #fff }</style>`,
      );

      const headScript = await fetch(host + "/head-script", { method: "GET" });
      assertExists(
        await headScript.text(),
        `<script>console.log('script')</script>`,
      );

      const noScriptLink = await fetch(host + "/no-script", { method: "GET" });
      assertExists(
        await noScriptLink.text(),
        `<noscript><link rel="stylesheet" href="app.jss"/></noscript>`,
      );

      f.close();
      await f.finished();
    },
    sanitizeResources: false,
    sanitizeOps: false,
    sanitizeExit: false,
  },
);
