// DO NOT DELETE THIS IMPORT - it's used in the build process to generate the CSS bundle
import postcss from "npm:postcss@^8.5.6";
import tailwindcss from "npm:@tailwindcss/postcss@^4.1.18";
import autoprefixer from "npm:autoprefixer@^10.4.23";
import cssnano from "npm:cssnano@^7.1.2";
// END OF DO NOT DELETE

import { Context } from "../../core/types.ts";

function render(content: string) {
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/css",
      "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
    },
  });
}

async function processCss(staticDir: string) {
  const plugins = [
    autoprefixer,
    tailwindcss,
    cssnano,
  ];

  try {
    const path = Deno.cwd() + staticDir + "/css/tailwind.css";
    const content = Deno.readTextFileSync(path);
    return await postcss(plugins).process(content, {
      from: "undefined",
      to: "undefined",
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function tailwind(pathname = "/styles.css", staticDir = "/static") {
  const isProd = Deno.env.get("FASTRO_ENV") === "production" ||
    Deno.env.get("ENV") === "production";

  if (isProd) {
    const fileName = pathname.split("/").pop() || "app.css";
    const prebuiltPath = Deno.cwd() + "/public/css/" + fileName;
    try {
      const prebuilt = Deno.readTextFileSync(prebuiltPath);
      return (
        req: Request,
        _context: Context,
        next: () => Response | Promise<Response>,
      ) => {
        const url = new URL(req.url);
        if (url.pathname !== pathname) return next();
        return new Response(prebuilt, {
          status: 200,
          headers: {
            "Content-Type": "text/css",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      };
    } catch (_err) {
      console.warn(
        `Prebuilt Tailwind CSS not found at ${prebuiltPath}, falling back to on-the-fly processing.`,
      );
    }
  }

  const cache = new Map<string, string>();
  return async (
    req: Request,
    _context: Context,
    next: () => Response | Promise<Response>,
  ) => {
    const url = new URL(req.url);
    if (url.pathname !== pathname) return next();

    const cached = cache.get(pathname);
    if (cached) return render(cached);

    const result = await processCss(staticDir);
    if (result) {
      cache.set(pathname, result.content);
      return render(result.content);
    }
    return next();
  };
}
