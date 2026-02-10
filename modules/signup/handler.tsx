import { Handler } from "../../core/types.ts";
import App from "./App.tsx";
import { createToken } from "../../middlewares/jwt/mod.ts";
import { hashPassword } from "../../utils/password.ts";

const JWT_SECRET = Deno.env.get("JWT_SECRET") || "fastro-secret";

export const signupHandler: Handler = async (req, ctx) => {
  if (req.method === "POST") {
    const s = ctx.state as Record<string, unknown> | undefined;
    let form = s?.formData as FormData | undefined;
    // Fallback: if no body parsing middleware installed, read form directly
    if (!form) {
      try {
        // Attempt to read form data from the Request directly
        // and store it in ctx.state for consistency.
        const fd = await req.formData();
        form = fd;
        if (s) s.formData = fd;
      } catch {
        // ignore; will be handled below as missing form
      }
    }
    let error: string | null = null;
    let identifier = "";
    let password = "";

    if (!form) {
      error = "No form data received";
    } else {
      identifier = String(form.get("identifier") ?? "").trim();
      password = String(form.get("password") ?? "");
      if (!identifier || !password) {
        error = "Both fields are required";
      } else {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
        // Basic phone validation: optional +, then 7-15 digits
        const isPhone = /^\+?\d{7,15}$/.test(identifier);
        if (!isEmail && !isPhone) {
          error = "Identifier must be a valid email or phone number";
        }
      }
    }

    if (!error) {
      try {
        if (ctx.kv) {
          const existing = await ctx.kv.get(["user", identifier]);
          if (existing.value) {
            error = "User already exists";
          } else {
            const { salt, hash } = await hashPassword(password);
            await ctx.kv.set(["user", identifier], {
              hash,
              salt,
              createdAt: Date.now(),
            });
          }
        }
      } catch (e) {
        console.error("KV operation failed:", e);
        error = "Failed to save user";
      }
    }

    // Do not include raw password in the initial props used for hydration.
    const safeData = { identifier };

    // On successful signup, create JWT and redirect the user to dashboard.
    if (!error) {
      try {
        const token = await createToken({ user: identifier }, JWT_SECRET);
        if (typeof ctx.setCookie === "function") {
          ctx.setCookie("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24,
            sameSite: "Lax",
            secure: Deno.env.get("ENV") === "production",
          });
        }
      } catch (e) {
        console.error("Failed to set JWT cookie:", e);
      }

      return new Response(null, {
        status: 303,
        headers: { Location: "/dashboard" },
      });
    }

    const html = ctx.renderToString!(
      <App submitted={!error} error={error} data={safeData} />,
      {
        includeDoctype: true,
        title: "Signup",
        initialProps: { submitted: !error, error, data: safeData },
        module: "signup",
      },
    );

    return new Response(html, { headers: { "Content-Type": "text/html" } });
  }

  const html = ctx.renderToString!(<App />, {
    includeDoctype: true,
    title: "Signup",
  });

  return new Response(html, { headers: { "Content-Type": "text/html" } });
};
