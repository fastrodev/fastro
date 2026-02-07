/* c8 ignore file */
import { join } from "@std/path";
import type { Middleware } from "./types.ts";

/**
 * Automatically register modules from a directory.
 */
export async function autoRegisterModules(
  app: { use: (middleware: Middleware) => void },
  modulesDirParam?: URL | string,
) {
  const cwd = Deno.cwd();
  console.log(`[Loader] Current working directory: ${cwd}`);
  console.log(`[Loader] import.meta.url: ${import.meta.url}`);

  let modulesDir: URL | string;
  if (modulesDirParam) {
    modulesDir = modulesDirParam;
    console.log(`[Loader] Using provided modulesDirParam: ${modulesDir}`);
  } else {
    // Try to find modules folder relative to CWD first
    const pathFromCwd = join(cwd, "modules");
    console.log(`[Loader] Checking directory at: ${pathFromCwd}`);
    try {
      const stats = Deno.statSync(pathFromCwd);
      if (stats.isDirectory) {
        modulesDir = pathFromCwd;
        console.log(`[Loader] Found modules directory at CWD: ${modulesDir}`);
      } else {
        modulesDir = new URL("../modules/", import.meta.url);
        console.log(`[Loader] Not a directory, falling back to import.meta.url: ${modulesDir}`);
      }
    } catch (err) {
      modulesDir = new URL("../modules/", import.meta.url);
      console.log(`[Loader] Stat failed, falling back to import.meta.url: ${modulesDir}`);
      console.log(`[Loader] Stat error: ${err}`);
    }
  }

  const entries: Deno.DirEntry[] = [];

  try {
    console.log(`[Loader] Reading directory entries from: ${modulesDir}`);
    for await (const entry of Deno.readDir(modulesDir)) {
      if (entry.isDirectory) {
        entries.push(entry);
      }
    }
    console.log(`[Loader] Found ${entries.length} module(s): ${entries.map(e => e.name).join(", ")}`);
  } catch (err) {
    console.error(`[Loader] autoRegisterModules: failed to read ${modulesDir}:`, err);
    return;
  }

  entries.sort((a, b) => {
    if (a.name === "index") return -1;
    if (b.name === "index") return 1;
    if (a.name === "profile") return 1;
    if (b.name === "profile") return -1;
    return a.name.localeCompare(b.name);
  });

  for (const entry of entries) {
    let modPath: string;
    if (typeof modulesDir === "string") {
      const maybeDir = modulesDir.endsWith("/") ? modulesDir : modulesDir + "/";
      const full = maybeDir + entry.name + "/mod.ts";
      if (full.startsWith("/")) {
        modPath = new URL("file://" + full).href;
      } else {
        modPath = new URL(full, `file://${cwd}/`).href;
      }
    } else {
      modPath = new URL(`${entry.name}/mod.ts`, modulesDir).href;
    }

    console.log(`[Loader] Importing module: ${modPath}`);
    try {
      const mod = await import(modPath);

      if (mod.default) {
        app.use(mod.default);
        console.log(`[Loader] Registered default export from ${entry.name}`);
      } else if (mod[entry.name]) {
        app.use(mod[entry.name]);
        console.log(`[Loader] Registered ${entry.name} export from ${entry.name}`);
      } else {
        console.warn(`[Loader] No valid export found in ${entry.name}/mod.ts`);
      }
    } catch (err) {
      const e = err as Error & { code?: string };
      if (e.code === "ERR_MODULE_NOT_FOUND") {
        console.warn(`[Loader] Module not found: ${modPath}`);
        continue;
      }
      console.error(`[Loader] Failed to import ${modPath}:`, err);
    }
  }
}
