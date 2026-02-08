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
  // Gunakan default value yang berbasis URL absolut
  manifestPathParam: string | URL | Record<string, unknown> =
    new URL("../manifest.ts", import.meta.url).href,
) {
  const registerFromNamespace = (name: string, ns: Record<string, unknown>) => {
    const def = ns.default as unknown;
    if (typeof def === "function") {
      app.use(def as unknown as Middleware);
      console.info(`✅ Registered default export from ${name}/mod.ts`);
      return true;
    }

    const named = ns[name];
    if (typeof named === "function") {
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
      manifest = manifestPathParam as Record<string, unknown>;
      console.info(`[Loader] Using provided manifest object; keys=` +
        Object.keys(manifest).join(", "));
    } else {
      specifier = manifestPathParam instanceof URL
        ? manifestPathParam.href
        : String(manifestPathParam);

      console.info(`[Loader] Importing manifest from: ${specifier}`);

      try {
        const imported = await import(specifier);
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

    const names = sortNames(Object.keys(manifest));
    console.info(`[Loader] Sorted manifest names=` + names.join(", "));

    for (const name of names) {
      const ns = manifest[name] as Record<string, unknown> | undefined;
      console.debug(`[Loader] Processing namespace ${name}; present=${!!ns}`);
      try {
        if (ns) {
          const ok = registerFromNamespace(name, ns);
          console.info(`[Loader] registerFromNamespace result for ${name}: ${ok}`);
        } else {
          console.warn(`[Loader] Namespace ${name} is undefined`);
        }
      } catch (regErr) {
        console.error(`[Loader] Error registering namespace ${name}:`, regErr);
      }
    }
  } catch (err) {
    // Log full error with stack so Deno Deploy shows the cause
    console.error(`❌ [Loader] Critical error loading/processing manifest:`, err);
    throw err;
  }
}
