// deno-lint-ignore-file no-explicit-any
import tailwindCss, { Config } from "npm:tailwindcss@3.4.1";
import postcss from "https://deno.land/x/postcss@8.4.16/mod.js";
import cssnano from "npm:cssnano@6.0.1";
import autoprefixer from "npm:autoprefixer@10.4.16";
import * as path from "https://deno.land/std@0.221.0/path/mod.ts";
import { TailwindPluginOptions } from "./types.ts";
import { Context, HttpRequest } from "../../http/server/types.ts";
import { getDevelopment } from "../../http/server/mod.ts";
import { STATUS_CODE, STATUS_TEXT } from "../../http/server/deps.ts";

function render(content: string) {
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/css",
      "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
    },
  });
}

/**
 * Inspired and modified from the tailwind fresh plugin: https://github.com/denoland/fresh/blob/main/plugins/tailwind.ts
 *
 * @param config
 * @param options
 * @returns
 */
async function createProcessor(
  config: {
    staticDir: string;
    dev: boolean;
  },
  options: TailwindPluginOptions,
) {
  const configPath = Deno.cwd() + "/tailwind.config.ts";
  const url = path.toFileUrl(configPath).href;
  const tailwindConfig = (await import(url)).default as Config;

  if (!Array.isArray(tailwindConfig.content)) {
    throw new Error(`Expected tailwind "content" option to be an array`);
  }

  tailwindConfig.content = tailwindConfig.content.map((pattern) => {
    if (typeof pattern === "string") {
      const relative = path.relative(Deno.cwd(), path.dirname(configPath));

      if (!relative.startsWith("..")) {
        return path.join(relative, pattern);
      }
    }
    return pattern;
  });

  const plugins = [
    tailwindCss(tailwindConfig) as any,
    autoprefixer(options.autoprefixer) as any,
  ];

  if (!config.dev) {
    plugins.push(cssnano());
  }

  return postcss(plugins);
}

async function processCss(staticDir: string) {
  try {
    const processor = await createProcessor({
      staticDir,
      dev: false,
    }, {});

    const path = Deno.cwd() + "/static/tailwind.css";
    const content = await Deno.readTextFile(path);
    const result = await processor.process(content, {
      from: undefined,
    });

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function tailwind(pathname = "/styles.css", staticDir = "/") {
  const cache = new Map<string, string>();
  const [s] = Deno.args.filter((v) => v === "--build");
  if (s) {
    console.log(
      `%cBuild: %cstyles.css`,
      "color: blue",
      "color: white",
    );

    processCss(staticDir).then((result) => {
      const outPath = Deno.cwd() + "/static/styles.css";
      if (result) Deno.writeTextFile(outPath, result.content);
    });
    return () => {};
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
      const result = await processCss(staticDir);
      if (result) {
        cache.set(pathname, result.content);
        return render(result.content);
      }
    }

    try {
      const path = Deno.cwd() + "/static/styles.css";
      const content = await Deno.readTextFile(path);
      cache.set(pathname, content);
      return render(content);
    } catch {
      return new Response(STATUS_TEXT[STATUS_CODE.NotFound], {
        status: STATUS_CODE.NotFound,
      });
    }
  }

  return m;
}
