import { createRouter, kvMiddleware } from "../../deps.ts";
import type { Server } from "../../deps.ts";
import {
  getCanonical,
  renderBlog,
  renderCode,
  renderMD,
  renderStatic,
} from "./render.ts";
import { registerCodeRoutes, serveFolder } from "./code.ts";

export default function register(app: Server) {
  const r = createRouter(app);

  r.get(
    "/",
    (req, ctx) => renderMD("README.md", ctx.kv, getCanonical(req)),
    kvMiddleware,
  );

  r.get("/blog", (req, ctx) => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const search = url.searchParams.get("search") || "";
    return renderBlog(page, search, ctx.kv, getCanonical(req));
  }, kvMiddleware);
  r.get(
    "/posts/:post",
    (req, ctx) =>
      renderMD(`posts/${ctx.params.post}.md`, ctx.kv, getCanonical(req)),
    kvMiddleware,
  );

  // Dynamic page renderer for files under `pages/`.
  async function isPageAllowed(name: string) {
    try {
      const dirUrl = new URL(`../../pages/`, import.meta.url);
      for await (const entry of Deno.readDir(dirUrl)) {
        if (!entry.isFile) continue;
        const baseName = entry.name.split(".")[0].toUpperCase();
        if (baseName === name.toUpperCase()) return true;
      }
    } catch {
      // ignore
    }
    return false;
  }

  async function findPageFile(name: string, preferExt?: string) {
    try {
      const dirUrl = new URL(`../../pages/`, import.meta.url);
      const targetMd = `${name.toLowerCase()}.md`;
      const targetHtml = `${name.toLowerCase()}.html`;

      for await (const entry of Deno.readDir(dirUrl)) {
        if (!entry.isFile) continue;
        const fileLower = entry.name.toLowerCase();
        if (preferExt === ".md" || (!preferExt && fileLower === targetMd)) {
          if (fileLower === targetMd) return `pages/${entry.name}`;
        }
        if (preferExt === ".html" || (!preferExt && fileLower === targetHtml)) {
          if (fileLower === targetHtml) return `pages/${entry.name}`;
        }
      }
    } catch {
      // ignore
    }
    return null;
  }

  r.get("/:page", async (req, ctx) => {
    const raw = ctx.params.page; // e.g. DOCS or DOCS.md or DOCS.html
    const m = raw.match(/^(.+?)(\.(md|html))?$/i);
    if (!m) return new Response("Not Found", { status: 404 });
    const name = m[1];
    const ext = m[2] ? m[2].toLowerCase() : null;
    const canonical = getCanonical(req);

    if (!(await isPageAllowed(name))) {
      return new Response("Not Found", { status: 404 });
    }

    // If extension specified, try that first (respect user's explicit request)
    if (ext === ".md") {
      const file = await findPageFile(name, ".md");
      if (file) return renderMD(file, ctx.kv, canonical);
      const alt = await findPageFile(name, ".html");
      if (alt) return renderStatic(alt);
      return new Response("Not Found", { status: 404 });
    }

    if (ext === ".html") {
      const file = await findPageFile(name, ".html");
      if (file) return renderStatic(file);
      const alt = await findPageFile(name, ".md");
      if (alt) return renderMD(alt, ctx.kv, canonical);
      return new Response("Not Found", { status: 404 });
    }

    // No extension: prefer markdown, then html (case-insensitive)
    const mdFile = await findPageFile(name, ".md");
    if (mdFile) return renderMD(mdFile, ctx.kv, canonical);
    const htmlFile = await findPageFile(name, ".html");
    if (htmlFile) return renderStatic(htmlFile);
    return new Response("Not Found", { status: 404 });
  }, kvMiddleware);

  r.get(
    "/LICENSE",
    (req, ctx) => renderCode("LICENSE", ctx.kv, getCanonical(req)),
    kvMiddleware,
  );

  // register folder handlers
  r.get("/core/*", serveFolder("core"));
  r.get("/build/*", serveFolder("build"));

  registerCodeRoutes(r);
}
