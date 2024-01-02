import { TailwindPluginOptions } from "./types.ts";
import { Context, HttpRequest } from "../../src/server/types.ts";

async function initTailwind(
  config: { staticDir: string; dev: boolean },
  options: TailwindPluginOptions,
) {
  return await (await import("./compiler.ts")).initTailwind(
    config,
    options,
  );
}

function render(content: string) {
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/css",
      "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
    },
  });
}

export function tailwind(pathname = "/styles.css", staticDir = "/") {
  const cache = new Map<string, string>();
  async function m(_req: HttpRequest, ctx: Context) {
    if (ctx.url.pathname !== pathname) {
      return ctx.next();
    }

    const cached = cache.get(pathname);
    if (cached) {
      return render(cached);
    }

    const processor = await initTailwind({
      staticDir,
      dev: false,
    }, {});
    const content = await Deno.readTextFile(Deno.cwd() + "/static/styles.css");
    const result = await processor.process(content, {
      from: undefined,
    });

    cache.set(pathname, result.content);
    return render(result.content);
  }

  return m;
}
