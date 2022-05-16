import application, { response } from "../../server/mod.ts";
import rendering from "../../server/ssr.ts";
import App from "./app.tsx";
import Hello from "./hello/app.tsx";

const appPage = rendering(<App />)
  .dir("./examples/ssr");

const helloPage = rendering(<Hello />)
  .dir("./examples/ssr/hello");

const app = application()
  .static("/static")
  .page("/", appPage, () => {
    return response()
      .ssr(appPage)
      .title("Hello world")
      .render();
  })
  .page("/hello", helloPage, (req: Request) => {
    return response()
      .ssr(helloPage)
      .title("Click me")
      .meta(`<meta charset="utf-8" />`)
      .script(`<script>(function (){})();</script>`)
      .style(`<style>body {background-color: powderblue;}</style>`)
      .render(req);
  });

console.log("Listening on: http://localhost:8000");

await app.serve();
