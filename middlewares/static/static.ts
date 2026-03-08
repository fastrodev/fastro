import { Context, Middleware } from "../../mod.ts";

/**
 * Middleware for serving static files from a directory.
 *
 * @param urlPrefix The URL prefix that should trigger static file serving.
 * @param dirPath The local directory path containing the static files.
 * @param options Optional configuration including SPA fallback and index file.
 * @returns A middleware function to handle static file requests.
 */
export function staticFiles(
  urlPrefix: string,
  dirPath: string,
  options?: { spaFallback?: boolean; indexFile?: string; fallback?: string },
): Middleware {
  const contentTypes: Record<string, string> = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".xml": "application/xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".txt": "text/plain",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".eot": "application/vnd.ms-fontobject",
  };

  const normalizedPrefix = urlPrefix.endsWith("/")
    ? urlPrefix.slice(0, -1)
    : urlPrefix;
  const baseDir = dirPath.startsWith("./") ? dirPath.slice(2) : dirPath;

  const isProduction = Deno.env.get("ENV") === "production";
  const spaFallback = options?.spaFallback ?? false;
  const indexFile = options?.indexFile ?? "index.html";
  const fallbackFile = options?.fallback ||
    (spaFallback ? indexFile : undefined);

  const fileCache = isProduction
    ? new Map<
      string,
      { content: Uint8Array; contentType: string; expiry: number }
    >()
    : null;
  const FILE_CACHE_TTL = 3600000; // 1 hour
  const MAX_FILE_CACHE_SIZE = 100; // Cache up to 100 files

  return async (
    req: Request,
    _context: Context,
    next: () => Response | Promise<Response>,
  ) => {
    if (req.method !== "GET") {
      return next();
    }

    const url = new URL(req.url);
    if (!url.pathname.startsWith(normalizedPrefix)) {
      return next();
    }

    const pathname = url.pathname.slice(normalizedPrefix.length);
    const isDirectory = pathname === "" || pathname === "/" ||
      pathname.endsWith("/");
    const hasExtension = pathname.includes(".") && !isDirectory;

    // Helper to serve a physical file
    const serveFile = async (path: string, isFallback = false) => {
      const cacheKey = isFallback ? `__fallback_${path}__` : path;
      const now = Date.now();

      if (isProduction) {
        const cached = fileCache!.get(cacheKey);
        if (cached && cached.expiry > now) {
          fileCache!.delete(cacheKey);
          fileCache!.set(cacheKey, cached);
          return new Response(new Uint8Array(cached.content), {
            headers: {
              "Content-Type": cached.contentType,
              "Cache-Control": "public, max-age=3600",
            },
          });
        }
      }

      const relative = path.replace(/^\/+/, "");
      const filePath = `${baseDir}/${relative}`;

      try {
        const file = await Deno.readFile(filePath);
        const dot = relative.lastIndexOf(".");
        const ext = dot >= 0 ? relative.substring(dot).toLowerCase() : "";
        const contentType = contentTypes[ext] ||
          (isFallback ? "text/html" : "application/octet-stream");

        if (isProduction) {
          if (fileCache!.size >= MAX_FILE_CACHE_SIZE) {
            const oldestKey = fileCache!.keys().next().value;
            if (oldestKey) fileCache!.delete(oldestKey);
          }
          fileCache!.delete(cacheKey);
          fileCache!.set(cacheKey, {
            content: file,
            contentType,
            expiry: now + FILE_CACHE_TTL,
          });
        }

        const cacheControl = isProduction
          ? "public, max-age=3600"
          : "no-cache, no-store, must-revalidate";

        return new Response(new Uint8Array(file), {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": cacheControl,
          },
        });
      } catch {
        return null; // File not found
      }
    };

    // 1. Asset requests (e.g. /app.js): File System Priority
    if (hasExtension) {
      const fileResp = await serveFile(pathname);
      if (fileResp) return fileResp;
      // If asset not found physically, let router try
      return next();
    }

    // 2. Directory or Clean URL (e.g. /, /dashboard): Router Priority
    const routeResp = await next();
    if (routeResp.status !== 404) {
      return routeResp;
    }

    // 3. Router returned 404: Try index file for directory
    if (isDirectory && indexFile) {
      const indexFilePath = pathname === "" || pathname === "/"
        ? `/${indexFile}`
        : (pathname.endsWith("/") ? `${pathname}${indexFile}` : pathname);
      const indexResp = await serveFile(indexFilePath);
      if (indexResp) return indexResp;
    }

    if (fallbackFile) {
      const fallbackResp = await serveFile(fallbackFile, true);
      if (fallbackResp) return fallbackResp;
    }

    return routeResp; // Final 404
  };
}
