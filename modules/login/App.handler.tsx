import { Context } from "../../mod.ts";
import { App } from "./App.tsx";

export function appHandler(_req: Request, ctx: Context) {
  console.log("DEBUG: ctx.state.module =", ctx.state?.module);
  const html = ctx.renderToString!(
    <App />,
    {
      includeDoctype: true,
      title: "Login",
    },
  );

  return new Response(html, { headers: { "Content-Type": "text/html" } });
}
