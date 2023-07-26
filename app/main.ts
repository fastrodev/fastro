import fastro, { Context, HttpRequest, Next } from "../http/server.ts";
import markdown from "../middlewares/markdown.tsx";
import app from "../pages/app.tsx";
import Example from "../pages/example.tsx";
import index from "../pages/index.tsx";
import { denoRunCheck, getExamples, getVersion, init } from "./function.ts";
import { html } from "./layout.ts";

const title = "The Web Framework for Full Stack Apps";
const description =
  "Handle React SSR and thousands of RPS with a minimalistic API";
const f = new fastro();
const m = new markdown({ folder: "docs" });
f.record["examples"] = await getExamples();
f.use(m.middleware);

f.use((req: HttpRequest, _ctx: Context, next: Next) => {
  console.log(`%c${req.method} %c${req.url}`, "color: blue", "color: green");
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
    html: { head: { title: "React component" } },
  });
});

f.page(
  "/",
  index,
  async (req: HttpRequest, ctx: Context) => {
    const res = denoRunCheck(req);
    if (res) return init();
    const git = await getVersion();
    const opt = html(
      { version: git["name"], path: "home", title, description },
      title,
      description,
    );
    return ctx.render(opt);
  },
);

f.page("/examples", Example, async (req: HttpRequest, ctx: Context) => {
  const examples = req.record["examples"];
  const git = await getVersion();
  const options = html(
    { version: git["name"], path: "examples", title, description, examples },
    title,
    description,
  );
  return ctx.render(options);
});

f.onListen(({ port, hostname }) => {
  console.log(`Listening on http://${hostname}:${port}`);
});

await f.serve();
