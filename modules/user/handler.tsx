import { Handler } from "../../core/types.ts";
import App from "./App.tsx";
import { verifyToken } from "../../middlewares/jwt/jwt.ts";

const JWT_SECRET = Deno.env.get("JWT_SECRET") || "fastro-secret";

export const userHandler: Handler = async (_req, ctx) => {
  const username = ctx.params.username;
  if (!username) {
    return new Response("Not Found", { status: 404 });
  }

  let name = "";
  let bio = "";
  let notFound = false;

  if (ctx.kv) {
    const res = await ctx.kv.get(["user", username]);
    if (res?.value) {
      const userData = res.value as Record<string, unknown>;
      name = (userData.name as string) || "";
      bio = (userData.bio as string) || "";
    } else {
      notFound = true;
    }
  } else {
    // If KV is not available, we can't show the profile.
    // In a real app, this should be handled better.
    notFound = true;
  }

  // Pass current authenticated user (if any) from ctx.state.user to the render
  // Check cookie for token and verify it to determine authenticated user
  let currentUser: string | undefined = undefined;
  try {
    const cookieHeader = _req.headers.get("cookie");
    if (cookieHeader) {
      const m = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
      if (m) {
        const token = decodeURIComponent(m[1]);
        const payload = await verifyToken<{ user: string }>(token, JWT_SECRET);
        if (payload && typeof payload.user === "string") {
          currentUser = payload.user;
        }
      }
    }
  } catch (_e) {
    // ignore token verification errors and treat as unauthenticated
  }

  const html = ctx.renderToString!(
    <App
      username={username}
      name={name}
      bio={bio}
      notFound={notFound}
      currentUser={currentUser}
    />,
    {
      includeDoctype: true,
      title: notFound ? "User Not Found" : `${name || username}'s Profile`,
      initialProps: { username, name, bio, notFound, currentUser },
      head: `<head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Fastro App</title>
          <link rel="stylesheet" href="/css/app.css">
      </head>`,
    },
  );

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
    status: notFound ? 404 : 200,
  });
};
