import { Context, HttpRequest } from "@app/mod.ts";
import addEmail from "@app/modules/wait/wait.service.ts";
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

export default async function waitHandler(req: HttpRequest, ctx: Context) {
  const res = denoRunCheck(req);
  if (res) return init();

  const ses = await getSession(req, ctx);
  const isLogin = ses?.isLogin;
  const avatar_url = ses?.avatar_url;
  const html_url = ses?.html_url; // Fixed the typo here, was using avatar_url twice

  // Redirect to home page if user is already logged in
  if (isLogin) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/home",
      },
    });
  }

  return await ctx.render({
    title: "Web Framework for Deno",
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
