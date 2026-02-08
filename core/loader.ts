import { join } from "@std/path";
import type { Middleware } from "./types.ts";

export async function autoRegisterModules(
  app: { use: (middleware: Middleware) => void },
  modulesDirParam?: string,
  // When true, skip attempting to import the static `manifest.ts` and
  // force the non-production fallback. This is intended for tests that
  // need to exercise the fallback path without interfering with the
  // module cache. Default: false.
  skipStaticManifest = false,
) {
  const isDeploy = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
  const isDebug = Deno.env.get("FASTRO_LOG_LOADER") === "true";
  const debug = (...args: unknown[]) => {
    if (isDeploy || isDebug) console.debug(...args);
  };

  const cwd = Deno.cwd();
  debug(`[Loader] Current working directory: ${cwd}`);
  debug(`[Loader] import.meta.url: ${import.meta.url}`);

  // Helper: sort names (index first, profile last when present)
  const sortNames = (names: string[]) => {
    return names.sort((a, b) => {
      if (a === "index") return -1;
      if (b === "index") return 1;
      if (a === "profile") return 1;
      if (b === "profile") return -1;
      return a.localeCompare(b);
    });
  };

  // Helper: register middleware from a namespace object (manifest export)
  const registerFromNamespace = (name: string, ns: Record<string, unknown>) => {
    const def = ns.default as unknown;
    if (typeof def === "function") {
      app.use(def as unknown as Middleware);
      console.log(`Registered default export from ${name}/mod.ts (manifest)`);
      return true;
    }

    const named = ns[name];
    if (typeof named === "function") {
      app.use(named as unknown as Middleware);
      console.log(`Registered ${name} export from ${name}/mod.ts (manifest)`);
      return true;
    }

    console.warn(`[Loader] No valid export found in manifest for ${name}`);
    return false;
  };

  const isProd = isDeploy || Deno.env.get("FASTRO_ENV") === "production";

  // Try to load a static manifest first (this is required in production).
  try {
    if (skipStaticManifest) throw new Error("skipStaticManifest");
    const manifest = await import("../manifest.ts");
    const names = sortNames(Object.keys(manifest));
    for (const name of names) {
      const ns = (manifest as Record<string, unknown>)[name] as
        | Record<string, unknown>
        | undefined;
      if (!ns) {
        console.warn(`[Loader] manifest export ${name} is empty or invalid`);
        continue;
      }
      registerFromNamespace(name, ns);
    }
    return;
  } catch (err) {
    const e = err instanceof Error ? err : new Error(String(err));
    debug(
      `[Loader] No manifest found or failed to import manifest: ${e.message}`,
    );
    if (isProd) {
      console.error(
        "[Loader] Manifest missing in production. Please generate manifest.ts at repository root during build.",
      );
      throw e;
    }
    // Non-prod: fallthrough to in-memory generation
  }

  // Non-production fallback: build manifest in-memory (no writes).
  debug("[Loader] Building manifest in-memory (non-production)");

  const modulesPath = modulesDirParam || join(cwd, "modules");

  const names: string[] = [];
  try {
    for await (const entry of Deno.readDir(modulesPath)) {
      if (entry.isDirectory) names.push(entry.name);
    }
  } catch (err) {
    const e = err instanceof Error ? err : new Error(String(err));
    console.error(`[Loader] Failed to read ${modulesPath}:`, e);
    return;
  }

  const sorted = sortNames(names);
  debug(`[Loader] Found modules: ${sorted.join(", ")}`);

  for (const name of sorted) {
    const moduleUrl =
      new URL(`../modules/${name}/mod.ts`, import.meta.url).href;
    debug(`[Loader] Importing module: ${moduleUrl}`);
    try {
      const mod = await import(moduleUrl);
      registerFromNamespace(name, mod as Record<string, unknown>);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      console.error(
        `❌ [Loader] Failed to import ${name} at ${moduleUrl}:`,
        e.message,
      );
    }
  }
}
