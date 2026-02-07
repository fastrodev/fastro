/* c8 ignore file */
import { join } from "@std/path";
import type { Middleware } from "./types.ts";

export async function autoRegisterModules(
  app: { use: (middleware: Middleware) => void },
  modulesDirParam?: string,
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

  // // Helper: register middleware from a dynamically-imported module object
  // const registerFromModule = (
  //   entryName: string,
  //   mod: Record<string, unknown>,
  // ) => {
  //   if (mod.default && typeof mod.default === "function") {
  //     app.use(mod.default as unknown as Middleware);
  //     console.log(`✅ Registered default export from ${entryName}`);
  //     return true;
  //   }

  //   if (mod[entryName] && typeof mod[entryName] === "function") {
  //     app.use(mod[entryName] as unknown as Middleware);
  //     console.log(`✅ Registered named export: ${entryName}`);
  //     return true;
  //   }

  //   console.warn(`No valid export found in ${entryName}/mod.ts to register.`);
  //   return false;
  // };

  // If running in Deno Deploy Classic, prefer a statically-generated manifest
  // so the deploy bundler (eszip) includes modules. The manifest is generated
  // at build time by `scripts/generate_manifest.ts` and exported from
  // `modules/manifest.ts`.
  if (isDeploy) {
    try {
      const manifest = await import("../modules/manifest.ts");
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

      // Manifest-based registration done — skip runtime dynamic imports which
      // are not reliably supported on Deploy Classic.
      return;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      debug(
        `[Loader] No manifest found or failed to import manifest: ${e.message}`,
      );
      // fallthrough to filesystem-based dynamic loading (useful for local dev/tests)
    }
  }

  // Gunakan path fisik untuk Deno.readDir
  const modulesPath = modulesDirParam || join(cwd, "modules");

  const entries: Deno.DirEntry[] = [];
  try {
    for await (const entry of Deno.readDir(modulesPath)) {
      if (entry.isDirectory) entries.push(entry);
    }
  } catch (err) {
    const e = err instanceof Error ? err : new Error(String(err));
    console.error(`[Loader] Failed to read ${modulesPath}:`, e);
    return;
  }

  // Sorting logic
  entries.sort((a, b) => {
    if (a.name === "index") return -1;
    if (b.name === "index") return 1;
    return a.name.localeCompare(b.name);
  });

  debug(`[Loader] Found modules: ${entries.map((e) => e.name).join(", ")}`);

  for (const entry of entries) {
    // KUNCI: Gunakan URL relatif terhadap file ini (loader.ts)
    // Jika loader.ts ada di /src/core/, maka ../modules/ tepat sasaran
    const moduleUrl =
      new URL(`../modules/${entry.name}/mod.ts`, import.meta.url).href;

    debug(`[Loader] Importing module: ${moduleUrl}`);

    try {
      const mod = await import(moduleUrl);

      if (mod.default) {
        app.use(mod.default);
        console.log(`✅ Registered default export from ${entry.name}`);
      } else if (mod[entry.name]) {
        app.use(mod[entry.name]);
        console.log(`✅ Registered named export: ${entry.name}`);
      }
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      // Jika masih 'Module not found', berarti file tidak masuk ke bundle Deploy
      console.error(
        `❌ [Loader] Failed to import ${entry.name} at ${moduleUrl}:`,
        e.message,
      );
    }
  }
}
