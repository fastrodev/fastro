import { Handler } from "../../core/types.ts";
import App from "./App.tsx";
import { createToken } from "../../middlewares/jwt/mod.ts";

const JWT_SECRET = Deno.env.get("JWT_SECRET") || "fastro-secret";

export const signupHandler: Handler = async (req, ctx) => {
  if (req.method === "POST") {
    const s = ctx.state as Record<string, unknown> | undefined;
    const form = s?.formData as FormData | undefined;
    let error: string | null = null;
    let identifier = "";
    let password = "";

    if (!form) {
      error = "No form data received";
    } else {
      identifier = String(form.get("identifier") ?? "").trim();
      password = String(form.get("password") ?? "");
      if (!identifier || !password) error = "Both fields are required";
    }

    if (!error) {
      try {
        if (ctx.kv) {
          await ctx.kv.set(["user", identifier], {
            password,
            createdAt: Date.now(),
          });
        }
      } catch (e) {
        console.error("KV set failed:", e);
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
