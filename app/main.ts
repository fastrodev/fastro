import fastro, { Context, HttpRequest, Next } from "../http/server.ts";
import markdown from "../middlewares/markdown.tsx";
import app from "../pages/app.tsx";
import Example from "../pages/example.tsx";
import index from "../pages/index.tsx";
import { html } from "./layout.ts";

const f = new fastro();

const m = new markdown();

f.use(m.middleware);

f.use((req: HttpRequest, _ctx: Context, next: Next) => {
  console.log(`${req.method} ${req.url}`);
  return next();
});

f.get("/api", () => {
  return Response.json({ time: new Date().getTime() });
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

function denoRunCheck(req: HttpRequest) {
  const regex = /^Deno\/(\d+\.\d+\.\d+)$/;
  const string = req.headers.get("user-agent");
  if (!string) return false;
  const match = regex.exec(string);
  if (!match) return false;
  return true;
}

function init() {
  const basePath = Deno.env.get("DENO_DEPLOYMENT_ID")
    ? `https://raw.githubusercontent.com/fastrodev/fastro/main/static`
    : "http://localhost:8000/static";
  const code = `import init, { version } from "${basePath}/init.ts"; 
const name = Deno.args[0] ?? 'my-project';
await init(name, version)
`;
  return new Response(code, {
    headers: {
      "content-type": "application/typescript; charset=utf-8",
    },
  });
}

f.page(
  "/",
  index,
  async (req: HttpRequest, ctx: Context) => {
    const res = denoRunCheck(req);
    if (res) return init();

    let git: Record<string, string>;
    try {
      const data = await fetch(
        "https://api.github.com/repos/fastrodev/fastro/releases/latest",
      );
      git = JSON.parse(await data.text());
    } catch {
      git = {};
      git["name"] = "local";
    }

    const title = "React Framework for Fullstack Development";
    const description =
      "Handle server side rendering and thousands of requests per second with a minimalistic API";

    const opt = html(
      { version: git["name"], path: "home", title, description },
      title,
      description,
    );
    return ctx.render(opt);
  },
);

f.page("/examples", Example, async (req: HttpRequest, ctx: Context) => {
  const res = denoRunCheck(req);
  if (res) return init();

  let git: Record<string, string>;
  try {
    const data = await fetch(
      "https://api.github.com/repos/fastrodev/fastro/releases/latest",
    );
    git = JSON.parse(await data.text());
  } catch {
    git = {};
    git["name"] = "local";
  }

  const title = "The React Framework for Fullstack Web Development";
  const description =
    "Handle server side rendering and thousands of requests per second with a minimalistic API";
  const options = html(undefined, title, description);
  return ctx.render(options);
});

f.onListen(({ port, hostname }) => {
  console.log(`Listening on http://${hostname}:${port}`);
});

await f.serve();
