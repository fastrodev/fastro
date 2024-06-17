import Server from "$fastro/mod.ts";
import indexApp from "$fastro/modules/web/index.page.tsx";
import markdown from "$fastro/middleware/markdown/mod.tsx";
import blogLayout from "$fastro/modules/web/blog.layout.tsx";
import docsLayout from "$fastro/modules/web/docs.layout.tsx";
import { index } from "$fastro/modules/web/index.layout.tsx";
import { tailwind } from "$fastro/middleware/tailwind/mod.ts";
import { HttpRequest } from "$fastro/http/server/types.ts";
import { authModule } from "$fastro/modules/auth/auth.mod.tsx";

const s = new Server();

/** markdown with default folder and prefix */
s.use(markdown(blogLayout));

/** markdown with 'docs' folder and prefix */
s.use(markdown(docsLayout, "docs", "docs"));

/** setup tailwind */
s.use(tailwind());

/** setup docs endpoint */
s.get("/docs", (_req, _ctx) => {
  const start = Deno.env.get("ENV") === "DEVELOPMENT"
    ? "http://localhost:8000/docs/start"
    : "https://fastro.deno.dev/docs/start";
  return Response.redirect(start, 307);
});

/** proxy for github repo */
s.use(async (_req, ctx) => {
  if (
    ctx.url.pathname.endsWith(".ts") ||
    ctx.url.pathname.endsWith(".tsx")
  ) {
    const version = ctx.url.pathname.startsWith("/v")
      ? ""
      : ctx.url.pathname.startsWith("/canary")
      ? "/canary"
      : "/main";

    const path =
      `https://raw.githubusercontent.com/fastrodev/fastro${version}${ctx.url.pathname}`;
    const res = await fetch(path);
    const content = await res.text();
    return new Response(content);
  }
  return ctx.next();
});

/** setup SSR */
s.page("/", {
  component: indexApp,
  layout: index,
  folder: "modules/web",
  handler: (req, ctx) => {
    const res = denoRunCheck(req);
    if (res) return init();
    return ctx.render({
      title: "Fast and Modular Web Framework",
      description:
        "Build high-performance SSR web applications that leverage flat modularity",
      youtube: "https://www.youtube.com/embed/cZc4Jn5nK3k",
      image:
        "https://avatars.githubusercontent.com/u/84224795?s=400&u=a53076f3dac46609e2837bef9980ae22ecd86e62&v=4",
      start: Deno.env.get("ENV") === "DEVELOPMENT"
        ? "http://localhost:8000/docs/start"
        : "https://fastro.deno.dev/docs/start",
      baseUrl: Deno.env.get("ENV") === "DEVELOPMENT"
        ? "http://localhost:8000"
        : "https://fastro.deno.dev",
    });
  },
});

s.group(authModule);

s.serve();

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
  const code =
    `import init from "${basePath}/init.ts"; const name = Deno.args[0] ?? 'project'; await init(name);`;
  return new Response(code, {
    headers: {
      "content-type": "application/typescript; charset=utf-8",
    },
  });
}
