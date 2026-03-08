import { Context } from "../../core/types.ts";
import { App } from "./App.tsx";

export function appHandler(_req: Request, ctx: Context) {
  const html = ctx.renderToString!(
    <App />,
    {
      includeDoctype: true,
      title: "Sign In",
      module: "index",
      initialProps: {},
      head: `<head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sign in</title>
          <style>
            body { margin: 0; font-family: 'Inter', Arial, sans-serif; background: #12121b; color: #e4e4e7; }
            input:focus, button:focus { outline: 2px solid #0070f3; }
            input::placeholder { color: #6b7280; }
            button:hover { background: #005bb5; }
          </style>
        </head>`,
    },
  );

  return new Response(html, { headers: { "Content-Type": "text/html" } });
}
