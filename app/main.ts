import App, { autoRegisterModules } from "../mod.ts";
import { logger } from "../middlewares/logger/mod.ts";
import { staticFiles } from "../middlewares/static/static.ts";
import { createRenderMiddleware } from "../middlewares/render/mod.ts";
import { cookieMiddleware } from "../middlewares/cookie/mod.ts";
// import { tailwind } from "../middlewares/tailwind/mod.ts";

const app = new App();

app.use(createRenderMiddleware());
app.use(logger);

// Cookie helper (parses incoming cookies and allows setting cookies)
app.use(cookieMiddleware);
// Serve module client bundles from /js -> ./public/js so render middleware
// can reference `/js/<module>/client.js`.
// app.use(tailwind("/css/app.css"));
app.use(staticFiles("/css", "./public/css"));
app.use(staticFiles("/js", "./public/js"));

// Keep legacy static mapping for assets under /static
app.use(staticFiles("/static", "./public"));

// Auto-register modules.
autoRegisterModules(app);

// Alternatively, you can manually import and register modules like this:
app.serve({ port: Deno.args[0] ? parseInt(Deno.args[0]) : 8000 });
