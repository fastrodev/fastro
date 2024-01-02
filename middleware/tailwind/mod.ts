import { TailwindPluginOptions } from "./types.ts";
import { Context, HttpRequest } from "../../src/server/types.ts";
import { getDevelopment } from "../../src/server/mod.ts";

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

async function build(staticDir: string) {
  const processor = await initTailwind({
    staticDir,
    dev: false,
  }, {});

  const path = Deno.cwd() + "/static/tailwind.css";
  const content = await Deno.readTextFile(path);
  const result = await processor.process(content, {
    from: undefined,
  });

  return result;
}

export function tailwind(pathname = "/styles.css", staticDir = "/") {
  const cache = new Map<string, string>();
  const [s] = Deno.args.filter((v) => v === "--hydrate");
  if (s) {
    build(staticDir).then((result) => {
      const outPath = Deno.cwd() + "/static/styles.css";
      Deno.writeTextFile(outPath, result.content);
    });
    return;
  }

  async function m(_req: HttpRequest, ctx: Context) {
    if (ctx.url.pathname !== pathname) {
      return ctx.next();
    }

    const cached = cache.get(pathname);
    if (cached) {
      return render(cached);
    }

    if (getDevelopment()) {
      const result = await build(staticDir);
      cache.set(pathname, result.content);
      return render(result.content);
    }

    const path = Deno.cwd() + "/static/styles.css";
    const content = await Deno.readTextFile(path);
    cache.set(pathname, content);
    return render(content);
  }

  return m;
}
