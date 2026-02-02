import { Context, Middleware } from "../../mod.ts";

export function staticFiles(
  urlPrefix: string,
  dirPath: string,
  options?: { spaFallback?: boolean; indexFile?: string },
): Middleware {
  const contentTypes: Record<string, string> = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
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

    let pathname = url.pathname.slice(normalizedPrefix.length);

    if (pathname === "" || pathname === "/" || pathname.endsWith("/")) {
      pathname = pathname === "" ? `/${indexFile}` : `${pathname}${indexFile}`;
    }

    const cacheKey = pathname;
    const now = Date.now();

    // Check cache first (only if production)
    if (isProduction) {
      const cached = fileCache!.get(cacheKey);
      if (cached && cached.expiry > now) {
        // Move to end (LRU)
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

    // Build file path once
    const relative = pathname.replace(/^\/+/, "");
    const filePath = `${baseDir}/${relative}`;

    try {
      const file = await Deno.readFile(filePath);

      // Get content type once
      const dot = relative.lastIndexOf(".");
      const ext = dot >= 0 ? relative.substring(dot).toLowerCase() : "";
      const contentType = contentTypes[ext] || "application/octet-stream";

      // Cache management: LRU eviction if needed (only if production)
      if (isProduction) {
        if (fileCache!.size >= MAX_FILE_CACHE_SIZE) {
          const oldestKey = fileCache!.keys().next().value;
          if (oldestKey) {
            fileCache!.delete(oldestKey);
          }
        }
        // Cache the file content (Ensure it's at the end)
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
      if (spaFallback) {
        const fallbackKey = "__spa_fallback__";
        if (isProduction) {
          const cached = fileCache!.get(fallbackKey);
          if (cached && cached.expiry > now) {
            // Move to end (LRU)
            fileCache!.delete(fallbackKey);
            fileCache!.set(fallbackKey, cached);
            return new Response(new Uint8Array(cached.content), {
              headers: {
                "Content-Type": "text/html",
                "Cache-Control": "public, max-age=3600",
              },
            });
          }
        }

        try {
          const fallbackPath = `${baseDir}/${indexFile}`;
          const html = await Deno.readFile(fallbackPath);

          if (isProduction) {
            // LRU eviction if needed
            if (fileCache!.size >= MAX_FILE_CACHE_SIZE) {
              const oldestKey = fileCache!.keys().next().value;
              if (oldestKey) fileCache!.delete(oldestKey);
            }
            fileCache!.delete(fallbackKey);
            fileCache!.set(fallbackKey, {
              content: html,
              contentType: "text/html",
              expiry: now + FILE_CACHE_TTL,
            });
          }

          const cacheControl = isProduction
            ? "public, max-age=3600"
            : "no-cache, no-store, must-revalidate";

          return new Response(new Uint8Array(html), {
            headers: {
              "Content-Type": "text/html",
              "Cache-Control": cacheControl,
            },
          });
        } catch {
          // If even the fallback is missing, continue
        }
      }

      return next();
    }
  };
}
