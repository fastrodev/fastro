import tailwindCss, { Config } from "tailwindcss";
import postcss from "https://deno.land/x/postcss@8.4.16/mod.js";
import cssnano from "npm:cssnano@6.0.1";
import autoprefixer from "npm:autoprefixer@10.4.16";
import * as path from "https://deno.land/std@0.207.0/path/mod.ts";
import { TailwindPluginOptions } from "./types.ts";

export async function initTailwind(
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

  // PostCSS types cause deep recursion
  const plugins = [
    // deno-lint-ignore no-explicit-any
    tailwindCss(tailwindConfig) as any,
    // deno-lint-ignore no-explicit-any
    autoprefixer(options.autoprefixer) as any,
  ];

  if (!config.dev) {
    plugins.push(cssnano());
  }

  return postcss(plugins);
}
