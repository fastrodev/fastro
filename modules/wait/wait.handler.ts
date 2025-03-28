import { Context, HttpRequest } from "@app/mod.ts";
import addEmail from "@app/modules/wait/wait.service.ts";
import { getSessionId } from "@app/modules/auth/mod.tsx";

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

export default async function waitHandler(req: HttpRequest, ctx: Context) {
  const res = denoRunCheck(req);
  if (res) return init();

  const sessionId = await getSessionId(req);
  const hasSessionIdCookie = sessionId !== undefined;
  const isLogin = hasSessionIdCookie;
  let avatar_url = "";
  let html_url = "";
  if (sessionId) {
    const r = ctx.server.serverOptions[sessionId];
    if (r) {
      avatar_url = r.avatar_url;
      html_url = r.html_url;
    }
  }

  return await ctx.render({
    title: "Software Inventory & Purchasing",
    description:
      "Modern inventory & purchasing software to help small businesses automate stock control and procurement tasks.",
    image: "https://fastro.deno.dev/fastro.png",
    isLogin,
    avatar_url,
    html_url,
  });
}

export async function submitHandler(req: HttpRequest, _ctx: Context) {
  try {
    const body = await req.json();
    const email = body.email;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }

    await addEmail(email);

    return new Response(JSON.stringify({ message: "success" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
    });
  }
}
