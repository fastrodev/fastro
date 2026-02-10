import { Handler } from "../../core/types.ts";
import App from "./App.tsx";
import { createToken, verifyToken } from "../../middlewares/jwt/mod.ts";

const JWT_SECRET = Deno.env.get("JWT_SECRET") || "fastro-secret";

export const profileHandler: Handler = async (req, ctx) => {
  // Read JWT token from cookie
  const token = ctx.cookies?.token as string | undefined;
  let user: string | undefined;

  if (token) {
    const payload = await verifyToken<{ user: string }>(token, JWT_SECRET);
    if (payload) {
      user = payload.user;
    }
  }

  if (!user) {
    return new Response(null, {
      status: 303,
      headers: { Location: "/signin?msg=auth_required" },
    });
  }

  let msg = "";
  if (req.method === "POST") {
    const s = ctx.state as Record<string, unknown> | undefined;
    const form = s?.formData as FormData | undefined;
    if (form) {
      const usernameFromForm = String(form.get("username") ?? "").trim();
      const newUsername = usernameFromForm || user;
      const name = String(form.get("name") ?? "");
      const bio = String(form.get("bio") ?? "");

      if (ctx.kv && newUsername) {
        const key = ["user", user!];
        const res = await ctx.kv.get(key);
        const existingData = (res?.value as Record<string, unknown>) || {};

        const updatedData = {
          ...existingData,
          name,
          bio,
          updatedAt: Date.now(),
        };

        if (newUsername !== user) {
          const check = await ctx.kv.get(["user", newUsername]);
          if (check?.value) {
            msg = "Error: Username already taken!";
          } else {
            await ctx.kv.set(["user", newUsername], updatedData);
            await ctx.kv.delete(key);
            user = newUsername;
            const newToken = await createToken({ user }, JWT_SECRET);
            if (typeof ctx.setCookie === "function") {
              ctx.setCookie("token", newToken, {
                httpOnly: true,
                path: "/",
                maxAge: 60 * 60 * 24,
              });
            }
            msg = "Profile and username updated successfully!";
          }
        } else {
          await ctx.kv.set(key, updatedData);
          msg = "Profile updated successfully!";
        }
      }
    }
  }

  // Fetch current user data from KV
  let name = "";
  let bio = "";
  if (ctx.kv) {
    const res = await ctx.kv.get(["user", user]);
    if (res?.value) {
      const userData = res.value as Record<string, unknown>;
      name = (userData.name as string) || "";
      bio = (userData.bio as string) || "";
    }
  }

  const html = ctx.renderToString!(
    <App user={user} name={name} bio={bio} msg={msg} />,
    {
      includeDoctype: true,
      title: "User Profile",
      initialProps: { user, name, bio, msg },
    },
  );

  return new Response(html, { headers: { "Content-Type": "text/html" } });
};
