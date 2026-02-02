import App from "../../mod.ts";
import { logger } from "../../middlewares/logger/mod.ts";
import { staticFiles } from "../../middlewares/static/static.ts";
import { renderBlog, renderCode, renderMD, renderStatic } from "./render.ts";
import { registerCodeRoutes } from "./code.ts";

const app = new App();

app.use(logger);
app.use(staticFiles("/static", "./public"));

app.get("/", () => renderMD("README.md"));
app.get("/DOCS.md", () => renderMD("DOCS.md"));
app.get("/MIDDLEWARES.md", () => renderMD("MIDDLEWARES.md"));
app.get("/SHOWCASE.md", () => renderMD("SHOWCASE.md"));
app.get("/BENCHMARK.md", () => renderMD("BENCHMARK.md"));
app.get("/CONTRIBUTING.md", () => renderMD("CONTRIBUTING.md"));

app.get("/blog", () => renderBlog());
app.get("/blog/:post", (_req, ctx) => renderMD(`posts/${ctx.params.post}.md`));

registerCodeRoutes(app);

app.get("/LICENSE", () => renderCode("LICENSE"));

// Fallback for 404 / Not Found - acts as SPA fallback
app.get("*", () => renderStatic("public/index.html"));

if (import.meta.main) {
  app.serve({ port: parseInt(Deno.args[0]) || 8000 });
}

export { app };
