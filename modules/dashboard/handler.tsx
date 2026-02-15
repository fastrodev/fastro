import { Handler } from "../../core/types.ts";
import App from "./App.tsx";
import { verifyToken } from "../../middlewares/jwt/mod.ts";
import { join } from "@std/path";

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
  const isDeploy = !!Deno.env.get("DENO_DEPLOYMENT_ID");

  // Compute counts for pages and posts directories (best-effort)
  let pagesCount = 0;
  let postsCount = 0;
  let storageCount = 0;
  try {
    const pagesDir = join(Deno.cwd(), "pages");
    for await (const entry of Deno.readDir(pagesDir)) {
      if (entry.isFile) pagesCount++;
    }
  } catch {
    // ignore
  }

  try {
    const postsDir = join(Deno.cwd(), "posts");
    for await (const entry of Deno.readDir(postsDir)) {
      if (entry.isFile) postsCount++;
    }
  } catch {
    // ignore
  }

  // Compute number of files in public/img for storage metric
  try {
    const imgDir = join(Deno.cwd(), "public", "img");
    for await (const entry of Deno.readDir(imgDir)) {
      if (entry.isFile) storageCount++;
    }
  } catch {
    // ignore if folder missing or inaccessible
  }

  const html = ctx.renderToString!(
    <App
      user={user}
      name={name}
      isDeploy={isDeploy}
      pagesCount={pagesCount}
      postsCount={postsCount}
      storageCount={storageCount}
    />,
    {
      includeDoctype: true,
      title: "Dashboard",
      initialProps: {
        user,
        name,
        isDeploy,
        pagesCount,
        postsCount,
        storageCount,
      },
      head:
        `<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Fastro App</title><link rel="stylesheet" href="/css/app.css"></head>`,
    },
  );

  return new Response(html, { headers: { "Content-Type": "text/html" } });
};

// Dedicated GET signout handler for links that use GET
export const signoutHandler: Handler = (_req, ctx) => {
  if (typeof ctx.setCookie === "function") {
    ctx.setCookie("token", "", { path: "/", maxAge: 0 });
  }
  return new Response(null, {
    status: 303,
    headers: { Location: "/signin" },
  });
};
