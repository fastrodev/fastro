import { Handler } from "../../core/types.ts";
import App from "./App.tsx";

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

  const html = ctx.renderToString!(
    <App username={username} name={name} bio={bio} notFound={notFound} />,
    {
      includeDoctype: true,
      title: notFound ? "User Not Found" : `${name || username}'s Profile`,
      initialProps: { username, name, bio, notFound },
    },
  );

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
    status: notFound ? 404 : 200,
  });
};
