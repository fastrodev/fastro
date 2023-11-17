// deno-lint-ignore-file no-explicit-any
import fastro, { Context, HttpRequest, Next } from "$fastro/http/server.ts";
import { version } from "$fastro/app/version.ts";
import markdown from "$fastro/middlewares/markdown.tsx";
import app from "$fastro/pages/app.page.tsx";
import blog from "$fastro/pages/blog.page.tsx";
import Example from "$fastro/pages/example.page.tsx";
import index from "$fastro/pages/index.page.tsx";
import {
  denoRunCheck,
  getExamples,
  getPosts,
  init,
} from "$fastro/app/function.ts";
import { createHTML } from "$fastro/app/layout.tsx";
import { layout } from "$fastro/pages/layout.tsx";
import { authModule } from "$fastro/modules/auth.tsx";

const title = "Speed without complexity";
const description = "Handle thousands of RPS with a minimalistic API";
const f = new fastro();
const m = new markdown({ folder: "docs" });
const b = new markdown({ folder: "posts", prefix: "blog" });
f.use(m.middleware);
f.use(b.middleware);

f.record["examples"] = await getExamples();
f.record["posts"] = await getPosts();

f.use((req: HttpRequest, ctx: Context, next: Next) => {
  const remoteAddr = ctx.info.remoteAddr as any;
  const data = {
    url: req.url,
    method: req.method,
    transport: ctx.info.remoteAddr.transport,
    hostname: remoteAddr.hostname,
    port: remoteAddr.port,
    userAgent: req.headers.get("user-agent"),
    host: req.headers.get("host"),
    ua: req.headers.get("sec-ch-ua"),
    uaPlatform: req.headers.get("sec-ch-ua-platform"),
    fetchSite: req.headers.get("sec-fetch-site"),
  };
  console.info(JSON.stringify(data));
  return next();
});

f.get("/api", () => {
  return Response.json({ time: new Date().getTime() });
});

f.get("/docs", () => {
  return Response.redirect("https://fastro.dev/manual", 307);
});

f.get("/store", () => {
  return Response.json({ message: "Comming soon" });
});

f.get("/robots.txt", () =>
  `User-agent: *
Allow: /
`);

f.static("/static", { folder: "static" });

f.page("/app", app, (_req: HttpRequest, ctx: Context) => {
  return ctx.render({
    layout,
    build: true,
    cache: false,
    props: { data: "Guest" },
  });
});

f.page(
  "/blog/:post([a-zA-Z0-9]+)?",
  blog,
  (req: HttpRequest, ctx: Context) => {
    const opt = createHTML(
      {
        version: version,
        path: "blog",
        title: "Blog",
        description: "Blog",
        posts: req.record["posts"],
        htmlClass: "h-100",
      },
    );

    return ctx.render(opt);
  },
);

f.page(
  "/",
  index,
  (req: HttpRequest, ctx: Context) => {
    const res = denoRunCheck(req);
    if (res) return init();
    const opt = createHTML(
      {
        version,
        path: "home",
        title,
        description,
      },
    );
    return ctx.render(opt);
  },
);

f.page("/examples", Example, (req: HttpRequest, ctx: Context) => {
  const examples = req.record["examples"];
  const options = createHTML(
    {
      version,
      path: "examples",
      title,
      description,
      examples,
      htmlClass: "h-100",
    },
  );
  return ctx.render(options);
});

f.register(authModule);

f.onListen(({ port, hostname }) => {
  console.log(
    `%cListening on %chttp://${hostname}:${port}`,
    "color: green",
    "color: blue",
  );
});

await f.serve();
