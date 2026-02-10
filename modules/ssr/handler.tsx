import { Handler } from "../../core/types.ts";
import { App } from "./App.tsx";

export const ssrHandler: Handler = (_req, ctx) => {
  const props = { name: "SSR", serverTime: new Date().toISOString() };
  const appModule = "ssr";
  const appTitle = "Hello ssr app title";
  // now i want to pass props to the App component and render it to string
  // pass props both as component props and as `initialProps` so hydration
  // receives the same snapshot on the client.
  const html = ctx.renderToString!(<App {...props} />, {
    includeDoctype: true,
    title: appTitle,
    initialProps: props,
    module: appModule,
    head: `<head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Fastro App</title>
          <link rel="stylesheet" href="/css/app.css">
      </head>`,
  });

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
};
