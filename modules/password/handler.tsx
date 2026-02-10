import { Handler } from "../../core/types.ts";
import App from "./App.tsx";
import { hashPassword, verifyPassword } from "../../utils/password.ts";

export const passwordHandler: Handler = async (req, ctx) => {
  // derive current identifier from authenticated JWT payload
  const s = ctx.state as Record<string, unknown> | undefined;
  const authPayload = s?.user as Record<string, unknown> | undefined;
  const currentIdentifier = authPayload && authPayload.user
    ? String(authPayload.user)
    : undefined;

  // Require authenticated user (routes are protected by jwt middleware,
  // but double-check here and return Unauthorized if missing)
  if (!currentIdentifier) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (req.method === "POST") {
    const form = s?.formData as FormData | undefined;
    let error: string | null = null;
    let msg: string | null = null;
    const identifier = currentIdentifier;
    const current = String(form?.get("current_password") ?? "");
    const password = String(form?.get("password") ?? "");
    const confirm = String(form?.get("password_confirm") ?? "");

    if (!identifier) {
      error = "Identifier is required";
    } else if (!password) {
      error = "New password is required";
    } else if (password !== confirm) {
      error = "Passwords do not match";
    }

    if (!error) {
      try {
        if (ctx.kv) {
          const existing = await ctx.kv.get(["user", identifier]);
          const user = existing?.value as {
            hash?: string;
            salt?: string;
            password?: string;
            [key: string]: unknown;
          } | undefined;
          if (!user) {
            error = "User not found";
          } else {
            // Support legacy plaintext password entries and new hash+salt entries.
            let ok = false;
            if (user.hash && user.salt) {
              ok = await verifyPassword(
                current,
                String(user.salt),
                String(user.hash),
              );
            } else if (user.password) {
              ok = String(user.password) === current;
            }

            if (!ok) {
              error = "Current password is incorrect";
            } else {
              const { salt, hash } = await hashPassword(password);
              const updated = {
                ...user,
                hash,
                salt,
                updatedAt: Date.now(),
              } as Record<string, unknown>;
              if ("password" in updated) delete updated["password"];
              await ctx.kv.set(["user", identifier], updated);
              msg = "Password updated successfully";
            }
          }
        } else {
          error = "No KV available";
        }
      } catch (e) {
        console.error("KV operation failed:", e);
        error = "Failed to update password";
      }
    }

    const html = ctx.renderToString!(
      <App identifier={identifier} error={error} msg={msg} />,
      {
        includeDoctype: true,
        title: "Update Password",
        initialProps: { identifier, error, msg },
        module: "password",
      },
    );

    return new Response(html, { headers: { "Content-Type": "text/html" } });
  }

  const html = ctx.renderToString!(
    <App identifier={currentIdentifier} />,
    {
      includeDoctype: true,
      title: "Update Password",
      initialProps: { identifier: currentIdentifier },
    },
  );

  return new Response(html, { headers: { "Content-Type": "text/html" } });
};

export default passwordHandler;
