/**
 * Local adaptation of the Deno esbuild plugin.
 *
 * This file is derived from the denoland/deno-esbuild-plugin project
 * (https://github.com/denoland/deno-esbuild-plugin) and has been adapted
 * for the Fastro project's build system. Modifications include integration
 * with our workspace/loader usage and minor API adjustments to match our
 * `deno.json` mappings and build conventions.
 *
 * The original project is MIT licensed; retain the original license and
 * attribution when redistributing. See the upstream repository for the
 * full source and license: https://github.com/denoland/deno-esbuild-plugin
 */
import {
  MediaType,
  RequestedModuleType,
  ResolutionMode,
  Workspace,
  type WorkspaceOptions,
} from "@deno/loader";
import type {
  Loader,
  OnLoadArgs,
  OnLoadResult,
  OnResolveArgs,
  OnResolveResult,
  Platform,
  Plugin,
} from "esbuild";
import * as path from "@std/path";
import { isBuiltin } from "node:module";

export interface DenoPluginOptions {
  debug?: boolean;
  configPath?: string;
  noTranspile?: boolean;
  preserveJsx?: boolean;
  publicEnvVarPrefix?: string;
}

/**
 * Create an esbuild plugin that resolves and loads modules using Deno's
 * resolution and loader (via `@deno/loader`). The returned plugin can be
 * included in the `plugins` array passed to `esbuild.build` or `esbuild.transform`.
 *
 * @param options - Plugin configuration options (debugging, configPath, etc.)
 * @returns An `esbuild` `Plugin` implementing Deno-style resolution/load.
 */
export function denoPlugin(options: DenoPluginOptions = {}): Plugin {
  return {
    name: "deno",
    async setup(ctx) {
      const workspace = new Workspace({
        debug: options.debug,
        configPath: options.configPath,
        nodeConditions: ctx.initialOptions.conditions,
        noTranspile: options.noTranspile,
        preserveJsx: options.preserveJsx,
        platform: getPlatform(ctx.initialOptions.platform),
      });

      const loader = await workspace.createLoader();

      ctx.onDispose(() => {
        loader[Symbol.dispose]?.();
      });

      const externals = (ctx.initialOptions.external ?? []).map((item) =>
        externalToRegex(item)
      );

      const onResolve = async (
        args: OnResolveArgs,
      ): Promise<OnResolveResult | null> => {
        if (
          isBuiltin(args.path) || externals.some((reg) => reg.test(args.path))
        ) {
          return {
            path: args.path,
            external: true,
          };
        }
        const kind =
          args.kind === "require-call" || args.kind === "require-resolve"
            ? ResolutionMode.Require
            : ResolutionMode.Import;

        try {
          const res = await loader.resolve(args.path, args.importer, kind);

          let namespace: string | undefined;
          if (res.startsWith("file:")) {
            namespace = "file";
          } else if (res.startsWith("http:")) {
            namespace = "http";
          } else if (res.startsWith("https:")) {
            namespace = "https";
          } else if (res.startsWith("npm:")) {
            namespace = "npm";
          } else if (res.startsWith("jsr:")) {
            namespace = "jsr";
          }

          const resolved = res.startsWith("file:")
            ? path.fromFileUrl(res)
            : res;

          return {
            path: resolved,
            namespace,
          };
        } catch (err) {
          const couldNotResolveReg =
            /not a dependency and not in import map|Relative import path ".*?" not prefixed with/;

          if (err instanceof Error && couldNotResolveReg.test(err.message)) {
            return null;
          }

          throw err;
        }
      };

      // Esbuild doesn't detect namespaces in entrypoints. We need
      // a catchall resolver for that.
      ctx.onResolve({ filter: /.*/ }, onResolve);
      ctx.onResolve({ filter: /.*/, namespace: "file" }, onResolve);
      ctx.onResolve({ filter: /.*/, namespace: "http" }, onResolve);
      ctx.onResolve({ filter: /.*/, namespace: "https" }, onResolve);
      ctx.onResolve({ filter: /.*/, namespace: "data" }, onResolve);
      ctx.onResolve({ filter: /.*/, namespace: "npm" }, onResolve);
      ctx.onResolve({ filter: /.*/, namespace: "jsr" }, onResolve);

      const onLoad = async (
        args: OnLoadArgs,
      ): Promise<OnLoadResult | null> => {
        const url =
          args.path.startsWith("http:") || args.path.startsWith("https:") ||
            args.path.startsWith("npm:") || args.path.startsWith("jsr:")
            ? args.path
            : path.toFileUrl(args.path).toString();

        const moduleType = getModuleType(args.path, args.with);
        const res = await loader.load(url, moduleType);

        if (res.kind === "external") {
          return null;
        }

        const esbuildLoader = mediaToLoader(res.mediaType);

        const envPrefix = options.publicEnvVarPrefix;
        if (
          envPrefix &&
          moduleType === RequestedModuleType.Default
        ) {
          let code = new TextDecoder().decode(res.code);

          code = code.replaceAll(
            /Deno\.env\.get\(["']([^)]+)['"]\)|process\.env\.([\w_-]+)/g,
            (m, name, processName) => {
              if (name !== undefined && name.startsWith(envPrefix)) {
                return JSON.stringify(Deno.env.get(name));
              }
              if (
                processName !== undefined && processName.startsWith(envPrefix)
              ) {
                return JSON.stringify(Deno.env.get(processName));
              }
              return m;
            },
          );

          return {
            contents: code,
            loader: esbuildLoader,
          };
        }

        return {
          contents: res.code,
          loader: esbuildLoader,
        };
      };
      ctx.onLoad({ filter: /.*/, namespace: "file" }, onLoad);
      ctx.onLoad({ filter: /.*/, namespace: "jsr" }, onLoad);
      ctx.onLoad({ filter: /.*/, namespace: "npm" }, onLoad);
      ctx.onLoad({ filter: /.*/, namespace: "http" }, onLoad);
      ctx.onLoad({ filter: /.*/, namespace: "https" }, onLoad);
      ctx.onLoad({ filter: /.*/, namespace: "data" }, onLoad);
    },
  };
}

function mediaToLoader(type: MediaType): Loader {
  switch (type) {
    case MediaType.Jsx:
      return "jsx";
    case MediaType.JavaScript:
    case MediaType.Mjs:
    case MediaType.Cjs:
      return "js";
    case MediaType.TypeScript:
    case MediaType.Mts:
    case MediaType.Dmts:
    case MediaType.Dcts:
      return "ts";
    case MediaType.Tsx:
      return "tsx";
    case MediaType.Css:
      return "css";
    case MediaType.Json:
      return "json";
    case MediaType.Html:
      return "default";
    case MediaType.Sql:
      return "default";
    case MediaType.Wasm:
      return "binary";
    case MediaType.SourceMap:
      return "json";
    case MediaType.Unknown:
      return "default";
    default:
      return "default";
  }
}

function getPlatform(
  platform: Platform | undefined,
): WorkspaceOptions["platform"] {
  switch (platform) {
    case "browser":
      return "browser";
    case "node":
      return "node";
    case "neutral":
    default:
      return undefined;
  }
}

function getModuleType(
  file: string,
  withArgs: Record<string, string>,
): RequestedModuleType {
  switch (withArgs.type) {
    case "text":
      return RequestedModuleType.Text;
    case "bytes":
      return RequestedModuleType.Bytes;
    case "json":
      return RequestedModuleType.Json;
    default:
      if (file.endsWith(".json")) {
        return RequestedModuleType.Json;
      }
      return RequestedModuleType.Default;
  }
}

/**
 * Convert an esbuild `external` pattern into a RegExp. Supports `*` wildcards
 * in the pattern (e.g. `lodash*` => matches `lodash`, `lodash/map`, etc.).
 *
 * @param external - External specifier pattern as used in esbuild config
 * @returns RegExp matching external module specifiers
 */
export function externalToRegex(external: string): RegExp {
  return new RegExp(
    "^" + external.replace(/[-/\\^$+?.()|[\]{}]/g, "\\$&").replace(
      /\*/g,
      ".*",
    ) + "$",
  );
}
