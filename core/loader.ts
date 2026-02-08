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
  manifestPathParam: string | URL =
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
    // Pastikan path dikonversi ke string URL yang valid
    const specifier = manifestPathParam instanceof URL
      ? manifestPathParam.href
      : manifestPathParam;

    console.log(`[Loader] Importing manifest from: ${specifier}`);

    const manifest = await import(specifier);
    const names = sortNames(Object.keys(manifest));

    for (const name of names) {
      const ns = (manifest as Record<string, unknown>)[name] as
        | Record<string, unknown>
        | undefined;
      if (ns) registerFromNamespace(name, ns);
    }
  } catch (err) {
    // JANGAN di-silent agar Anda bisa melihat error di dashboard Deno Deploy
    console.error(`❌ [Loader] Critical error loading manifest:`, err);
  }
}
