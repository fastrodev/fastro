import { HttpServer as fastro } from "./http/server.ts";
import { Context, HttpRequest, Next, RenderOptions } from "./mod.ts";
import app from "./pages/app.tsx";
import index from "./pages/index.tsx";

const f = new fastro();

f.use((req: HttpRequest, _ctx: Context, next: Next) => {
  console.log(`${req.method} ${req.url}`);
  return next();
});

f.get("/api", () => {
  return Response.json({ time: new Date().getTime() });
});

f.static("/static", { folder: "static" });
f.page("/app", app, (_req: HttpRequest, ctx: Context) => {
  return ctx.props({ data: "Guest" }).render({
    build: true,
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
  await init(name, version)`;
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

    const options: RenderOptions = {
      build: false,
      html: {
        class: "h-100",
        head: {
          title: "Fastro | Web Application Framework",
          descriptions: "Fast & Simple Web Application Framework",
          meta: [{ charset: "utf-8" }, {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          }, {
            name: "description",
            content: "Fast & Simple Web Application Framework",
          }, {
            property: "og:image",
            content: "https://fastro.dev/static/image.png",
          }],
          link: [{
            href:
              "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css",
            rel: "stylesheet",
            integrity:
              "sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD",
            crossorigin: "anonymous",
          }, {
            href: "/static/cover.css",
            rel: "stylesheet",
          }],
          script: [{
            src:
              "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js",
            integrity:
              "sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN",
            crossorigin: "anonymous",
          }],
        },
        body: {
          class: "d-flex h-100 text-center text-bg-dark",
          rootClass:
            "cover-container d-flex w-100 h-100 p-3 mx-auto flex-column",
        },
      },
    };
    const data = await fetch(
      "https://api.github.com/repos/fastrodev/fastro/releases/latest",
    );
    const git = JSON.parse(await data.text());
    return ctx.props({ version: git["name"] }).render(options);
  },
);

f.onListen(({ port, hostname }) => {
  console.log(`Listening on http://${hostname}:${port}`);
});

await f.serve();
