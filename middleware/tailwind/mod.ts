// deno-lint-ignore-file no-explicit-any
import tailwindCss, { Config } from "npm:tailwindcss@3.4.4";
import postcss from "npm:postcss@8.4.35";
import cssnano from "npm:cssnano@6.0.1";
import autoprefixer from "npm:autoprefixer@10.4.16";
// import * as path from "jsr:@std/path@0.225.1";
import { TailwindPluginOptions } from "./types.ts";
import { Context, HttpRequest } from "../../http/server/types.ts";
import * as c from "../../tailwind.config.ts";

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
function createProcessor(
  config: {
    staticDir: string;
    dev: boolean;
  },
  options: TailwindPluginOptions,
) {
  // const configPath = await Deno.realPath("./tailwind.config.ts");
  // const url = path.toFileUrl(configPath).href;
  const tailwindConfig = c as unknown as Config;

  if (!Array.isArray(tailwindConfig.content)) {
    throw new Error(`Expected tailwind "content" option to be an array`);
  }

  // tailwindConfig.content = tailwindConfig.content.map((pattern) => {
  //   if (typeof pattern === "string") {
  //     const relative = path.relative(Deno.cwd(), path.dirname(configPath));

  //     if (!relative.startsWith("..")) {
  //       return path.join(relative, pattern);
  //     }
  //   }
  //   return pattern;
  // });

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
    const content = Deno.readTextFileSync(path);
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

  async function m(_req: HttpRequest, ctx: Context) {
    if (ctx.url.pathname !== pathname) {
      return ctx.next();
    }

    const cached = cache.get(pathname);
    if (cached) return render(cached);

    const result = await processCss(staticDir);
    if (result) {
      cache.set(pathname, result.content);
      return render(result.content);
    }
  }

  return m;
}
