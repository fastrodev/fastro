import { assertEquals } from "https://deno.land/std@0.198.0/assert/assert_equals.ts";
import { assertExists } from "https://deno.land/std@0.198.0/assert/assert_exists.ts";
import fastro, { Fastro, Info } from "../mod.ts";
import { assert } from "https://deno.land/std@0.198.0/assert/assert.ts";
import { BUILD_ID, Context, HttpRequest, Next } from "./server.ts";
import User from "../pages/user.page.tsx";

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
      f.patch("/", () => new Response("patch"));
      f.head("/", () => new Response(""));
      f.get("/hook", () => new Response("hook"));
      f.get("/tsx", () => <>TSX</>);
      f.get("/json", () => ({ value: "foo" }));
      f.get("/txt", () => "txt");
      f.get("/error", () => {
        throw new Error("error");
      });
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

      f.get("/nest", (_req: HttpRequest, ctx: Context) => {
        return ctx.send({ nest: ctx.server.getNest() });
      });

      f.use((req: HttpRequest, ctx: Context, next: Next) => {
        if (req.url === "http://localhost:8000/middleware2") {
          return new Response("middleware2");
        }
        return next();
      });

      f.register((f: Fastro) => {
        return f.get("/register", () => "register");
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

      const patch = await fetch(host, { method: "PATCH" });
      assert(await patch.text(), "patch");

      const head = await fetch(host, { method: "HEAD" });
      assertEquals(await head.text(), "");

      const hook = await fetch(host + "/hook", { method: "GET" });
      assertEquals(await hook.text(), "hook");

      const register = await fetch(host + "/register", { method: "GET" });
      assertEquals(await register.text(), "register");

      const tsx = await fetch(host + "/tsx", { method: "GET" });
      assertEquals(await tsx.text(), "TSX");

      const json = await fetch(host + "/json", { method: "GET" });
      assertEquals(await json.text(), `{"value":"foo"}`);

      const txt = await fetch(host + "/txt", { method: "GET" });
      assertEquals(await txt.text(), `txt`);

      const e = await fetch(host + "/error", { method: "GET" });
      assertExists(await e.text(), `Error: error\n`);

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
        `<!DOCTYPE html><html><head></head><body data-bs-theme="dark"><div id="root" data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">Page</div></body></html>`,
      );

      const nest = await fetch(host + "/nest", { method: "GET" });
      assertExists(
        await nest.text(),
        `"GETundefinedundefinedhttp://localhost:8000/"`,
      );

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
      const f = new fastro({ port: 8000 });
      f.onListen(() => {});
      f.static("/static", { folder: "static", maxAge: 90 });
      await f.serve({ port: 8000 });

      const get = await fetch(`${host}/static/post.css`, { method: "GET" });
      assertExists(await get.text(), `@media (min-width: 576px)`);

      const get2 = await fetch(`${host}/static/post.css`, { method: "GET" });
      assertExists(await get2.text(), `@media (min-width: 576px)`);

      const bin = await fetch(`${host}/static/bench.png`, { method: "GET" });
      assertEquals(bin.headers.get("content-type"), `image/png`);

      assertEquals(f.getStaticFolder(), "static");

      f.close();
      await f.finished();
    },
    sanitizeResources: false,
    sanitizeOps: false,
    sanitizeExit: false,
  },
);

Deno.test(
  {
    permissions: { net: true, env: true, read: true, write: true },
    name: "getStaticFileWithReferer",
    async fn() {
      const f = new fastro({ port: 8000 });
      f.onListen(() => {});
      f.static("/static", { folder: "static", maxAge: 90, referer: true });
      await f.serve({ port: 8000 });

      const get = await fetch(`${host}/static/post.css`, { method: "GET" });
      assertExists(await get.text(), `Not Found`);

      f.close();
      await f.finished();
    },
    sanitizeResources: false,
    sanitizeOps: false,
    sanitizeExit: false,
  },
);

Deno.test(
  {
    permissions: { net: true, env: true, read: true, write: true, run: true },
    name: "SSR",
    async fn() {
      Deno.env.set("ENV", "DEVELOPMENT");

      const f = new fastro();

      f.page("/ssr", User, (_req: HttpRequest, ctx: Context, next: Next) => {
        ctx.server.record["hello"] = "hello";
        return next();
      }, (req: HttpRequest, ctx: Context) => {
        return ctx.render({
          props: {
            contentType: req.headers.get("content-type"),
            data: ctx.server.record["hello"],
          },
        });
      });

      f.page("/props", User, (_req: HttpRequest, ctx: Context) => {
        return ctx.render({ props: { data: "user" } });
      });

      f.page("/title", User, (_req: HttpRequest, ctx: Context) => {
        return ctx.render({ html: { head: { title: "SSR Title" } } });
      });

      f.page("/desc", User, (_req: HttpRequest, ctx: Context) => {
        return ctx.render({ html: { head: { descriptions: "SSR Desc" } } });
      });

      f.page("/script", User, (_req: HttpRequest, ctx: Context) => {
        return ctx.render({
          html: { head: { script: [{ src: "script.js" }] } },
        });
      });

      f.page("/link", User, (_req: HttpRequest, ctx: Context) => {
        return ctx.render({
          html: { head: { link: [{ href: "app.css" }] } },
        });
      });

      f.page("/head-style", User, (_req: HttpRequest, ctx: Context) => {
        return ctx.render({
          html: { head: { headStyle: `body { color: #fff }` } },
        });
      });

      f.page("/head-script", User, (_req: HttpRequest, ctx: Context) => {
        return ctx.render({
          html: { head: { headScript: `console.log('script')` } },
        });
      });

      f.page("/no-script", User, (_req: HttpRequest, ctx: Context) => {
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
        `<h1>Hello hello</h1>`,
      );

      const page2 = await fetch(host + "/ssr", { method: "GET" });
      assertExists(
        await page2.text(),
        `<h1>Hello hello</h1>`,
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

      const js = await fetch(host + `/${BUILD_ID}/user.js`, {
        method: "GET",
      });
      assertEquals(
        await js.text(),
        `Not Found`,
      );

      const refresh = await fetch(host + `/ssr`, {
        method: "GET",
      });
      assertExists(
        await refresh.text(),
        `<script src=/${BUILD_ID}/refresh.js">`,
      );

      const refreshPath = await fetch(host + `/${BUILD_ID}/refresh.js`, {
        method: "GET",
      });
      assertEquals(
        await refreshPath.text(),
        `Not Found`,
      );

      const stream = await fetch(host + `/___refresh___`, {
        method: "GET",
      });
      assertEquals(
        stream.headers.get("content-type"),
        `text/event-stream`,
      );

      const init = await fetch(host + `/__INITIAL_DATA__`, {
        method: "GET",
      });
      assertEquals(
        init.headers.get("content-type"),
        `text/plain;charset=UTF-8`,
      );

      f.close();
      await f.finished();
    },
    sanitizeResources: false,
    sanitizeOps: false,
    sanitizeExit: false,
  },
);
