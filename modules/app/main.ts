import App from "../../mod.ts";
import { renderBlog, renderCode, renderMD } from "./render.ts";

const app = new App();

app.get("/", () => renderMD("README.md"));
app.get("/DOCS.md", () => renderMD("DOCS.md"));
app.get("/MIDDLEWARES.md", () => renderMD("MIDDLEWARES.md"));
app.get("/SHOWCASE.md", () => renderMD("SHOWCASE.md"));
app.get("/BENCHMARK.md", () => renderMD("BENCHMARK.md"));
app.get("/CONTRIBUTING.md", () => renderMD("CONTRIBUTING.md"));

app.get("/blog", () => renderBlog());
app.get("/blog/:post", (_req, ctx) => renderMD(`posts/${ctx.params.post}.md`));

app.get("/middlewares/logger.ts", () => renderCode("middlewares/logger.ts"));
app.get("/LICENSE", () => renderCode("LICENSE"));

app.serve({ port: parseInt(Deno.args[0]) || 8000 });
