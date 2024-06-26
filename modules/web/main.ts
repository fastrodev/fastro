import Server from "$fastro/mod.ts";
import indexApp from "$fastro/modules/web/index.page.tsx";
import markdown from "$fastro/middleware/markdown/mod.tsx";
import blogLayout from "$fastro/modules/web/blog.layout.tsx";
import docsLayout, { docToc } from "$fastro/modules/web/docs.layout.tsx";
import tocLayout from "$fastro/modules/web/toc.layout.tsx";
import tocApp from "$fastro/modules/web/toc.page.tsx";
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

s.page("/docs", {
  component: tocApp,
  layout: tocLayout,
  folder: "modules/web",
  handler: (_req, ctx) => {
    return ctx.render({
      title: "Docs",
      description: "Docs",
      destination: "/docs",
      posts: docToc,
    });
  },
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
      title: "Fast & Modular Web Framework",
      description:
        "Build high-performance server-side rendered (SSR) web applications that leverage a flat modular architecture for improved readability",
      image: "https://fastro.dev/fastro.png",
      start: Deno.env.get("ENV") === "DEVELOPMENT"
        ? "http://localhost:8000/docs/start"
        : "https://fastro.dev/docs/start",
      baseUrl: Deno.env.get("ENV") === "DEVELOPMENT"
        ? "http://localhost:8000"
        : "https://fastro.dev",
      new: "Collaboration and Profit Sharing",
      destination: "blog/collaboration",
    });
  },
});

s.page("/blog", {
  component: tocApp,
  layout: tocLayout,
  folder: "modules/web",
  handler: (_req, ctx) => {
    return ctx.render({
      title: "Blog",
      description: "Blog",
      destination: "/blog",
      posts: [
        {
          title: "Collaboration and Profit Sharing",
          url: "/blog/collaboration",
          date: "06/18/2024",
        },
        {
          title: "Set up Tailwind on Deno",
          url: "/blog/tailwind",
          date: "01/26/2024",
        },
        {
          title: "Deno KV OAuth Implementation",
          url: "/blog/oauth",
          date: "11/15/2023",
        },
        {
          title: "renderToReadableStream",
          url: "/blog/render_to_readable_stream",
          date: "10/26/2023",
        },
        {
          title: "React",
          url: "/blog/react",
          date: "10/22/2023",
        },
        {
          title: "Preact",
          url: "/blog/preact_and_encrypted_props",
          date: "08/16/2023",
        },
        {
          title: "Hello",
          url: "/blog/hello",
          date: "11/15/2023",
        },
      ],
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
