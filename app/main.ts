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

// Auto-register modules. On Deno Deploy classic the working directory is `/src`,
// so pass an explicit modules directory URL in that environment.
if (Deno.env.get("DENO_DEPLOYMENT_ID")) {
  await autoRegisterModules(app, new URL("file:///src/modules/"));
} else {
  await autoRegisterModules(app);
}

// SHOW CURRENT DIRECTORY FOR DEBUGGING PURPOSES
console.log("Current working directory:", Deno.cwd());

// await autoRegisterModules(app);

// If running on Deno Deploy (classic), avoid binding to an explicit TCP port.
// Deno Deploy expects the process to use the platform's HTTP handler. Detect
// deployment via the `DENO_DEPLOYMENT_ID` env var and call `serve` without
// specifying a port. Locally, keep the old behavior and allow passing a port
// as the first CLI argument (default 8000).
if (Deno.env.get("DENO_DEPLOYMENT_ID")) {
  // Let the runtime handle incoming requests (no explicit port binding).
  app.serve({});
} else {
  app.serve({ port: Deno.args[0] ? parseInt(Deno.args[0]) : 8000 });
}
