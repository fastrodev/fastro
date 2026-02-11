import App, { autoRegisterModules } from "../mod.ts";
import { logger } from "../middlewares/logger/mod.ts";
import { staticFiles } from "../middlewares/static/static.ts";
import { createRenderMiddleware } from "../middlewares/render/mod.ts";
import { cookieMiddleware } from "../middlewares/cookie/mod.ts";
import { tailwind } from "../middlewares/tailwind/mod.ts";

const app = new App();

app.use(createRenderMiddleware());
app.use(logger);

app.use(cookieMiddleware);
app.use(tailwind("/css/app.css"));
autoRegisterModules(app);
app.use(staticFiles("/", "./public"));
app.serve({ port: Deno.args[0] ? parseInt(Deno.args[0]) : 8000 });
