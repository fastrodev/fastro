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
  manifestPathParam = "../manifest.ts",
) {
  

  const registerFromNamespace = (name: string, ns: Record<string, unknown>) => {
    const def = ns.default as unknown;
    if (typeof def === "function") {
      app.use(def as unknown as Middleware);
      console.info(`Registered default export from ${name}/mod.ts (manifest)`);
      return true;
    }

    const named = ns[name];
    if (typeof named === "function") {
      app.use(named as unknown as Middleware);
      console.info(`Registered ${name} export from ${name}/mod.ts (manifest)`);
      return true;
    }

    console.warn(`[Loader] No valid export found in manifest for ${name}`);
    return false;
  };

  try {
    const manifest = await import(manifestPathParam);
    const names = sortNames(Object.keys(manifest));
    for (const name of names) {
      const ns = (manifest as Record<string, unknown>)[name] as
        | Record<string, unknown>
        | undefined;
      if (ns) registerFromNamespace(name, ns);
    }
  } catch (_err) {
    // silent fail
  }
}
