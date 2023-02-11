import App from "$fastro/examples/ssr/pages/app.tsx";
import application from "$fastro/server/mod.ts";
import rendering from "$fastro/server/ssr.ts";

const appPage = rendering(<App />)
  .dir("./examples/ssr/pages");

const app = application()
  .static("/static")
  .page("/", appPage, (req, res) => {
    return res.ssr(appPage)
      .title("Hello world")
      .meta(`name="viewport" content="width=device-width"`)
      .render();
  });

await app.serve();
