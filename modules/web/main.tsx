import Server from "../../mod.ts";
import indexApp from "./index.page.tsx";
import markdown from "../../middleware/markdown/mod.tsx";
import blogLayout from "./blog.layout.tsx";
import docsLayout from "./docs.layout.tsx";
import { index } from "./index.layout.tsx";
import { tailwind } from "../../middleware/tailwind/mod.ts";
import { HttpRequest } from "../../http/server/types.ts";
import { authModule } from "../auth/auth.mod.tsx";
import {
  contentType,
  encodeHex,
  extname,
  JSX,
  STATUS_CODE,
  STATUS_TEXT,
} from "../../http/server/deps.ts";

function denoRunCheck(req: HttpRequest) {
  const regex = /^Deno\/(\d+\.\d+\.\d+)$/;
  const string = req.headers.get("user-agent");
  if (!string) return false;
  const match = regex.exec(string);
  if (!match) return false;
  return true;
}

const s = new Server();

/** markdown with default folder and prefix */
s.use(markdown(blogLayout));

/** markdown with 'docs' folder and prefix */
s.use(markdown(docsLayout, "docs", "docs"));

/** setup tailwind */
s.use(tailwind());

/** setup docs endpoint */
s.get("/docs", (req, ctx) => {
  return Response.redirect("http://localhost:8000/docs/start", 307);
});

s.get("/:version/:file", async (req, _ctx) => {
  const version = req.params?.version;
  const file = req.params?.file;
  const res = await fetch(
    `https://raw.githubusercontent.com/fastrodev/fastro/${version}/${file}`,
  );
  const content = await res.text();
  return new Response(content);
});

/** setup SSR */
s.page("/", {
  component: indexApp,
  layout: index,
  folder: "modules/web",
  handler: (req, ctx) => {
    denoRunCheck(req);
    const res = denoRunCheck(req);
    if (res) return init();
    return ctx.render({
      title:
        "Don't settle for the status quo. Embrace the future of web development",
      description:
        "With the power of Deno and TypeScript, Fastro packages Preact JS and Tailwind CSS, providing a unified experience. It also gives you the modular structure necessary for building successful applications.",
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

function init() {
  const basePath = Deno.env.get("DENO_DEPLOYMENT_ID")
    ? `https://raw.githubusercontent.com/fastrodev/fastro/preact/static`
    : "http://localhost:8000";
  const code =
    `import init from "${basePath}/init.ts"; const name = Deno.args[0] ?? 'project'; await init(name);`;
  return new Response(code, {
    headers: {
      "content-type": "application/typescript; charset=utf-8",
    },
  });
}
