import { renderBlog, renderCode, renderMD } from "./render.ts";
import { registerCodeRoutes } from "./code.ts";
import { createRouter } from "../../core/router.ts";

const r = createRouter();

r.get("/", () => renderMD("README.md"));
r.get("/DOCS.md", () => renderMD("DOCS.md"));
r.get("/MIDDLEWARES.md", () => renderMD("MIDDLEWARES.md"));
r.get("/SHOWCASE.md", () => renderMD("SHOWCASE.md"));
r.get("/BENCHMARK.md", () => renderMD("BENCHMARK.md"));
r.get("/CONTRIBUTING.md", () => renderMD("CONTRIBUTING.md"));
r.get("/PRO.md", () => renderMD("PRO.md"));
r.get("/SIMPUL.md", () => renderMD("SIMPUL.md"));

r.get("/blog", (req) => {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const search = url.searchParams.get("search") || "";
  return renderBlog(page, search);
});
r.get("/blog/:post", (_req, ctx) => renderMD(`posts/${ctx.params.post}.md`));

registerCodeRoutes(r);

r.get("/LICENSE", () => renderCode("LICENSE"));

export default r.build();
