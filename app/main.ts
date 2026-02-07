import App, { autoRegisterModules } from "../mod.ts";
import { logger } from "../middlewares/logger/mod.ts";
import { staticFiles } from "../middlewares/static/static.ts";
import { createRenderMiddleware } from "../middlewares/render/mod.ts";

const app = new App();

app.use(createRenderMiddleware());
app.use(logger);
// Serve module client bundles from /js -> ./public/js so render middleware
// can reference `/js/<module>/client.js`.
app.use(staticFiles("/js", "./public/js"));

// Keep legacy static mapping for assets under /static
app.use(staticFiles("/static", "./public"));

await autoRegisterModules(app);

app.serve({ port: Deno.args[0] ? parseInt(Deno.args[0]) : 8000 });
