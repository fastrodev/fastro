import { Handler } from "../../core/types.ts";
import App from "./App.tsx";

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

    // On successful signup, redirect the user to the signin page.
    if (!error) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/signin" },
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
