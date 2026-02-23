import { Router } from "../../core/types.ts";
import { renderCode } from "./render.ts";

/**
 * Registers routes for viewing core framework source code.
 *
 * @param app The main application instance or router.
 */
export function registerCodeRoutes(app: Router) {
  const files = [
    "middlewares/static/static.ts",
    "middlewares/logger/logger.ts",
    "middlewares/bodyparser/bodyparser.ts",
    "middlewares/cookie/cookie.ts",
    "middlewares/cookie/mod.ts",
    "middlewares/cookie/cookie.test.ts",
    "middlewares/render/render.ts",
    "middlewares/cors/cors.ts",
    "middlewares/kv/kv.ts",
    "middlewares/jwt/jwt.ts",
    "core/loader.ts",
    "core/types.ts",
    "core/router.ts",
    "core/server.ts",
    "native.ts",
    "main.ts",
    "app/main.ts",
    "MIDDLEWARES.md",
    "middlewares/tailwind/tailwind.ts",
    "middlewares/tailwind/tailwind.test.ts",
    "posts/tailwind.md",
  ];

  for (const path of files) {
    app.get(`/${path}`, () => renderCode(path));
  }
}

// Generic file server handler for small repo subfolders
export function serveFolder(folder: string) {
  // text-like extensions should be served as text
  const textTypes = new Set([
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "md",
    "html",
    "css",
    "txt",
  ]);
  const mimes: Record<string, string> = {
    ts: "text/typescript; charset=utf-8",
    js: "application/javascript; charset=utf-8",
    json: "application/json; charset=utf-8",
    md: "text/markdown; charset=utf-8",
    html: "text/html; charset=utf-8",
    css: "text/css; charset=utf-8",
    map: "application/json; charset=utf-8",
    txt: "text/plain; charset=utf-8",
  };

  return async (req: Request) => {
    try {
      const url = new URL(req.url);
      const prefix = `/${folder}/`;
      if (!url.pathname.startsWith(prefix)) {
        return new Response("Not Found", { status: 404 });
      }
      const rel = url.pathname.slice(prefix.length);
      if (!rel || rel.includes("..")) {
        return new Response("Not Found", { status: 404 });
      }

      const fileUrl = new URL(`../../${folder}/${rel}`, import.meta.url);
      const ext = rel.split(".").pop()?.toLowerCase() || "";

      if (textTypes.has(ext)) {
        const content = await Deno.readTextFile(fileUrl);
        return new Response(content, {
          headers: {
            "content-type": mimes[ext] || "text/plain; charset=utf-8",
          },
        });
      }

      const data = await Deno.readFile(fileUrl);
      return new Response(data, {
        headers: { "content-type": mimes[ext] || "application/octet-stream" },
      });
    } catch {
      return new Response("Not Found", { status: 404 });
    }
  };
}
