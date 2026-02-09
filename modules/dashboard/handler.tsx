import { Handler } from "../../core/types.ts";
import App from "./App.tsx";

export const dashboardHandler: Handler = (req, ctx) => {
  // Read user from cookie
  const user = ctx.cookies?.user as string | undefined;

  if (req.method === "POST") {
    // signout route: clear cookie and redirect
    if (typeof ctx.setCookie === "function") {
      ctx.setCookie("user", "", { path: "/", maxAge: 0 });
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
      headers: { Location: "/signin" },
    });
  }

  const html = ctx.renderToString!(<App user={user} />, {
    includeDoctype: true,
    title: "Dashboard",
    initialProps: { user },
  });

  return new Response(html, { headers: { "Content-Type": "text/html" } });
};
