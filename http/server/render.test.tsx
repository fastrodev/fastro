import { assert, assertEquals, assertExists } from "./deps.ts";
import fastro from "../../mod.ts";
import hello from "../../modules/web/hello.page.tsx";
import dear from "../../modules/web/dear.page.tsx";
import { layout } from "../../modules/web/app.layout.tsx";
const host = "http://localhost:8000";

Deno.test(
  {
    permissions: { net: true, env: true, read: true, write: true, run: true },
    name: "SSR",
    async fn() {
      const f = new fastro();
      f.page("/", {
        component: hello,
        layout,
        folder: "modules/web",
        handler: (_, ctx) => {
          return ctx.render({ title: "halaman page", data: "okeee page" });
        },
      }, (req, ctx) => {
        req.page = "page";
        return ctx.next();
      });

      f.page("/page", {
        component: <h1>Hello</h1>,
        layout,
        folder: "app",
        handler: (_, ctx) => {
          return ctx.render({ title: "halaman page", data: "okeee page" });
        },
      }, (req, ctx) => {
        req.page = "page";
        return ctx.next();
      });

      f.get("/hello", (_, ctx) => {
        return ctx.render(<h1>Hello</h1>);
      });

      await f.serve();

      const get = await fetch(host, { method: "GET" });
      const html = await get.text();
      assertExists(
        html,
        `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>halaman page</title><link href="/styles.css" rel="stylesheet"/></head><body id="root"><div><p>Count: 0</p><button>Increment</button><button>Decrement</button></div></body><script src="/js/hello`,
      );

      const helloFetch = await fetch(host + "/hello", { method: "GET" });
      const helloFetchHtml = await helloFetch.text();
      assertEquals(
        helloFetchHtml,
        `<h1>Hello</h1>`,
      );

      const page = await fetch(host + "/page", { method: "GET" });
      const pageHtml = await page.text();
      assertEquals(
        pageHtml,
        `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>halaman page</title><link href="/styles.css" rel="stylesheet"/></head><body id="root"><h1>Hello</h1></body></html>`,
      );

      await f.shutdown();
    },
    sanitizeResources: false,
    sanitizeOps: false,
    sanitizeExit: false,
  },
);

Deno.test(
  {
    permissions: { net: true, env: true, read: true, write: true, run: true },
    name: "params",
    async fn() {
      Deno.env.set("ENV", "DEVELOPMENT");

      const f = new fastro();

      f.get("/user/:id", (req, _) => {
        return Response.json({ data: req.params?.id });
      });

      f.page("/profile/:user", {
        component: dear,
        layout,
        folder: "modules/web",
        handler: (req, ctx) => {
          console.log(req.oke);
          return ctx.render({
            title: "halaman profile",
            data: "profilemu",
            user: req.params?.user,
          });
        },
      }, (req, ctx) => {
        console.log("params", req.params?.user);
        return ctx.next();
      });

      await f.serve();

      const helloFetch = await fetch(host + "/user/agus", {
        method: "GET",
      });
      const helloFetchHtml = await helloFetch.text();
      assertEquals(
        helloFetchHtml,
        `{"data":"agus"}`,
      );

      const propsFetch = await fetch(
        host + "/___refresh___",
        {
          method: "GET",
        },
      );

      assert(propsFetch.body instanceof ReadableStream);

      const dearFetch = await fetch(host + "/profile/agus", {
        method: "GET",
      });
      const dearFetchHtml = await dearFetch.text();
      assertExists(
        dearFetchHtml,
        `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>halaman profile</title><link href="/styles.css" rel="stylesheet"/></head><body id="root"><p class="font-extralight">Dear profilemu agus halaman profile</p></body><script src="/js/dear.`,
      );

      const jsFetch = await fetch(host + "/js/refresh.js", {
        method: "GET",
      });
      const jsFetchHtml = await jsFetch.text();
      assertExists(
        jsFetchHtml,
        `const es = new EventSource('/___refresh___')`,
      );

      const dearJsFetch = await fetch(host + "/js/dear.js", {
        method: "GET",
      });

      const dearJsFetchHtml = await dearJsFetch.text();
      assertExists(
        dearJsFetchHtml,
        `if(_n){let e="/__"+new URL(window.location.href).pathname+"/props",t=AbortSignal.timeout(8e3);fetch(e,{signal:t}).then(o=>o.json()).then(o=>{V(R(O,{data:o}),_n)}).catch(o=>{console.error("Error fetching data:",o)})}\n`,
      );

      const jsProps = await fetch(host + "/__/props/profile/agus", {
        method: "GET",
      });
      const jsPropsText = await jsProps.text();
      assertEquals(
        jsPropsText,
        `{"title":"halaman profile","data":"profilemu","user":"agus"}`,
      );

      await f.shutdown();
    },
    sanitizeResources: false,
    sanitizeOps: false,
    sanitizeExit: false,
  },
);
