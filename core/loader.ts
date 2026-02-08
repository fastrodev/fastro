import type { Middleware } from "./types.ts";

export const sortNames = (names: string[]) => {
  return names.sort((a, b) => {
    if (a === "index") return -1;
    if (b === "index") return 1;
    if (a === "profile") return 1;
    if (b === "profile") return -1;
    return a.localeCompare(b);
  });
};

export async function autoRegisterModules(
  app: { use: (middleware: Middleware) => void },
  // Gunakan default value yang berbasis relative path untuk menghindari masalah dengan file:// URL di Deno Deploy
  manifestPathParam: string | URL | Record<string, unknown> =
    "../manifest.ts",
) {
  console.log("[Loader] autoRegisterModules called with param:", manifestPathParam);

  const registerFromNamespace = (name: string, ns: Record<string, unknown>) => {
    console.log(`[Loader] registerFromNamespace called for ${name}, ns keys:`, Object.keys(ns));
    const def = ns.default as unknown;
    if (typeof def === "function") {
      console.log(`[Loader] Found default export for ${name}, type:`, typeof def);
      app.use(def as unknown as Middleware);
      console.info(`✅ Registered default export from ${name}/mod.ts`);
      return true;
    }

    const named = ns[name];
    if (typeof named === "function") {
      console.log(`[Loader] Found named export '${name}' for ${name}, type:`, typeof named);
      app.use(named as unknown as Middleware);
      console.info(`✅ Registered ${name} export from ${name}/mod.ts`);
      return true;
    }

    console.warn(`⚠️ [Loader] No valid export found for ${name}`);
    return false;
  };

  try {
    console.log("[Loader] autoRegisterModules start", {
      manifestParamType: typeof manifestPathParam,
    });

    // manifestPathParam may be: a manifest object, a URL, or a string specifier
    let manifest: Record<string, unknown> | undefined;
    let specifier: string | undefined;

    if (manifestPathParam && typeof manifestPathParam === "object" &&
      !(manifestPathParam instanceof URL)) {
      console.log("[Loader] Using manifest object directly");
      manifest = manifestPathParam as Record<string, unknown>;
      console.info(`[Loader] Using provided manifest object; keys=` +
        Object.keys(manifest).join(", "));
    } else {
      console.log("[Loader] Processing as specifier");
      specifier = manifestPathParam instanceof URL
        ? manifestPathParam.href
        : String(manifestPathParam);

      // Resolve relative paths to absolute URLs for Deno Deploy compatibility
      if (!specifier.startsWith("file://") && !specifier.startsWith("https://")) {
        specifier = import.meta.resolve(specifier);
        console.log("[Loader] Resolved specifier to:", specifier);
      }

      console.info(`[Loader] Importing manifest from: ${specifier}`);

      console.log("[Loader] About to import specifier:", specifier);
      try {
        const imported = await import(specifier);
        console.log("[Loader] Import successful, imported keys:", Object.keys(imported));
        manifest = imported as Record<string, unknown>;
        console.info(`[Loader] Imported manifest keys=` +
          Object.keys(manifest).join(", "));
      } catch (impErr) {
        console.error(`❌ [Loader] Failed to import manifest from ${specifier}`,
          impErr);
        throw impErr;
      }
    }

    if (!manifest) {
      console.warn("[Loader] No manifest available after import/resolve");
      return;
    }

    console.log("[Loader] Manifest loaded, sorting names");
    const names = sortNames(Object.keys(manifest));
    console.info(`[Loader] Sorted manifest names=` + names.join(", "));

    console.log("[Loader] Starting to process each module");
    for (const name of names) {
      console.log(`[Loader] Processing module: ${name}`);
      const ns = manifest[name] as Record<string, unknown> | undefined;
      console.debug(`[Loader] Processing namespace ${name}; present=${!!ns}`);
      try {
        if (ns) {
          console.log(`[Loader] Calling registerFromNamespace for ${name}`);
          const ok = registerFromNamespace(name, ns);
          console.info(`[Loader] registerFromNamespace result for ${name}: ${ok}`);
        } else {
          console.warn(`[Loader] Namespace ${name} is undefined`);
        }
      } catch (regErr) {
        console.error(`[Loader] Error registering namespace ${name}:`, regErr);
      }
    }
    console.log("[Loader] Finished processing all modules");
  } catch (err) {
    // Log full error with stack so Deno Deploy shows the cause
    console.error(`❌ [Loader] Critical error loading/processing manifest:`, err);
    throw err;
  }
}
