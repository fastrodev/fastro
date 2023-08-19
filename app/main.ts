import fastro, { Context, HttpRequest, Next } from "../http/server.ts";
import { version } from "../http/version.ts";
import markdown from "../middlewares/markdown.tsx";
import app from "../pages/app.tsx";
import blog from "../pages/blog.tsx";
import Example from "../pages/example.tsx";
import index from "../pages/index.tsx";
import { denoRunCheck, getExamples, getPosts, init } from "./function.ts";
import { createHTML } from "./layout.ts";

const title = "The Web Framework for Full Stack Apps";
const description = "Handle SSR and thousands of RPS with a minimalistic API";
const f = new fastro();
const m = new markdown({ folder: "docs" });
const b = new markdown({ folder: "posts", prefix: "blog" });
f.use(m.middleware);
f.use(b.middleware);

f.record["examples"] = await getExamples();
f.record["posts"] = await getPosts();

f.use((req: HttpRequest, ctx: Context, next: Next) => {
  const data = {
    remoteAddr: ctx.info.remoteAddr,
    userAgent: req.headers.get("user-agent"),
    host: req.headers.get("host"),
    ua: req.headers.get("sec-ch-ua"),
    uaPlatform: req.headers.get("sec-ch-ua-platform"),
    fetchSite: req.headers.get("sec-fetch-site"),
    url: req.url,
    method: req.method,
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

f.get("/robots.txt", () =>
  `User-agent: *
Allow: /
`);

f.static("/static", { folder: "static" });

f.page("/app", app, (_req: HttpRequest, ctx: Context) => {
  return ctx.render({
    build: true,
    cache: false,
    props: { data: "Guest" },
    html: { head: { title: "Preact component" } },
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
      "Blog",
      "Blog of Fastro Framework",
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
        htmlClass: "h-100",
      },
      title,
      description,
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
    title,
    description,
  );
  return ctx.render(options);
});

f.onListen(({ port, hostname }) => {
  console.log(
    `%cListening on %chttp://${hostname}:${port}`,
    "color: green",
    "color: blue",
  );
});

await f.serve();
