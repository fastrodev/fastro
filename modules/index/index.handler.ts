import { Context, HttpRequest } from "@app/mod.ts";
import { getSession } from "@app/utils/session.ts";

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

function denoRunCheck(req: HttpRequest) {
  const regex = /^Deno\/(\d+\.\d+\.\d+)$/;
  const string = req.headers.get("user-agent");
  if (!string) return false;
  const match = regex.exec(string);
  if (!match) return false;
  return true;
}

export const handler = async (req: HttpRequest, ctx: Context) => {
  const res = denoRunCheck(req);
  if (res) return init();

  const ses = await getSession(req, ctx);
  const ws_url = Deno.env.get("DENO_DEPLOYMENT_ID")
    ? "wss://fastro.deno.dev"
    : "ws://localhost:8000";

  if (ses) {
    return ctx.render({
      title: "Under construction ~ Home",
      isLogin: true,
      avatar_url: ses?.avatar_url,
      html_url: ses?.html_url,
      ws_url,
      username: ses?.username,
    });
  }

  return ctx.render({
    title: "Fast & Modular Web Framework",
    description:
      "Enhance SSR web app maintainability through a flat modular architecture",
    image: "https://fastro.dev/fastro.png",
    start: Deno.env.get("ENV") === "DEVELOPMENT"
      ? "http://localhost:8000/docs/start"
      : "https://fastro.dev/docs/start",
    baseUrl: Deno.env.get("ENV") === "DEVELOPMENT"
      ? "http://localhost:8000"
      : "https://fastro.dev",
    new: "Using Queues to Avoid Race Conditions",
    destination: "blog/queue",
  });
};
