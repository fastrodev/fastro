import { Handler } from "../../core/types.ts";
import App from "./App.tsx";

export const signinHandler: Handler = async (req, ctx) => {
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

    let authenticated = false;
    if (!error) {
      try {
        if (ctx.kv) {
          const res = await ctx.kv.get(["user", identifier]);
          const stored = res.value as { password?: string } | null;
          if (!stored) {
            error = "Belum terdaftar. Silakan daftar terlebih dahulu.";
          } else if (stored.password !== password) {
            error = "Invalid credentials";
          } else {
            authenticated = true;
          }
        } else {
          error = "KV not available";
        }
      } catch (e) {
        console.error("KV get failed:", e);
        error = "Failed to verify credentials";
      }
    }

    const safeData = { identifier };

    if (authenticated && !error) {
      // On success: set an HttpOnly cookie and redirect to dashboard
      try {
        if (typeof ctx.setCookie === "function") {
          ctx.setCookie("user", identifier, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24,
          });
        }
      } catch (e) {
        console.error("Failed to set cookie:", e);
      }
      return new Response(null, {
        status: 303,
        headers: { Location: "/dashboard" },
      });
    }

    const html = ctx.renderToString!(
      <App submitted={authenticated && !error} error={error} data={safeData} />,
      {
        includeDoctype: true,
        title: "Sign In",
        initialProps: {
          submitted: authenticated && !error,
          error,
          data: safeData,
        },
        module: "signin",
      },
    );

    return new Response(html, { headers: { "Content-Type": "text/html" } });
  }

  const html = ctx.renderToString!(<App />, {
    includeDoctype: true,
    title: "Sign In",
  });

  return new Response(html, { headers: { "Content-Type": "text/html" } });
};
