import { Handler } from "../../core/types.ts";
import App from "./App.tsx";
import { verifyToken } from "../../middlewares/jwt/mod.ts";

const JWT_SECRET = Deno.env.get("JWT_SECRET") || "fastro-secret";

export const dashboardHandler: Handler = async (req, ctx) => {
  // Read JWT token from cookie
  const token = ctx.cookies?.token as string | undefined;
  let user: string | undefined;

  if (token) {
    const payload = await verifyToken<{ user: string }>(token, JWT_SECRET);
    if (payload) {
      user = payload.user;
    }
  }

  if (req.method === "POST") {
    // signout route: clear cookie and redirect
    if (typeof ctx.setCookie === "function") {
      ctx.setCookie("token", "", { path: "/", maxAge: 0 });
    }
    return new Response(null, {
      status: 303,
      headers: { Location: "/signin" },
    });
  }

  // GET /dashboard
  if (!user) {
    return new Response(null, {
      status: 303,
      headers: { Location: "/signin?msg=auth_required" },
    });
  }

  let name: string | undefined;
  if (ctx.kv) {
    const res = await ctx.kv.get(["user", user]);
    if (res?.value) {
      name = (res.value as Record<string, unknown>).name as string;
    }
  }

  const html = ctx.renderToString!(<App user={user} name={name} />, {
    includeDoctype: true,
    title: "Dashboard",
    initialProps: { user, name },
  });

  return new Response(html, { headers: { "Content-Type": "text/html" } });
};
