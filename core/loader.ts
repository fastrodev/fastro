/* c8 ignore file */
import { join } from "@std/path"; // Gunakan toFileUrl dari std
import type { Middleware } from "./types.ts";

export async function autoRegisterModules(
  app: { use: (middleware: Middleware) => void },
  modulesDirParam?: URL | string,
) {
  const isDeploy = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
  const isDebug = Deno.env.get("FASTRO_LOG_LOADER") === "true";
  const debug = (...args: unknown[]) => {
    if (isDeploy || isDebug) console.log(...args);
  };

  const cwd = Deno.cwd();
  debug(`[Loader] Current working directory: ${cwd}`);
  debug(`[Loader] import.meta.url: ${import.meta.url}`);

  let modulesPath: string;

  // 1. Tentukan Path Fisik untuk Deno.readDir (butuh string path)
  if (modulesDirParam) {
    modulesPath = modulesDirParam instanceof URL
      ? modulesDirParam.pathname
      : modulesDirParam;
  } else {
    // Default: cari folder 'modules' di root proyek
    modulesPath = join(cwd, "modules");
  }

  // 2. Gunakan import.meta.url sebagai basis URL untuk Dynamic Import
  // Ini kunci utama agar jalan di Deploy
  const baseModuleUrl = new URL("../modules/", import.meta.url);

  const entries: Deno.DirEntry[] = [];
  try {
    debug(`[Loader] Reading directory entries from: ${modulesPath}`);
    for await (const entry of Deno.readDir(modulesPath)) {
      if (entry.isDirectory) {
        entries.push(entry);
      }
    }
    debug(
      `[Loader] Found ${entries.length} module(s): ${
        entries.map((e) => e.name).join(", ")
      }`,
    );
  } catch (err) {
    console.error(
      `[Loader] autoRegisterModules: failed to read ${modulesPath}:`,
      err,
    );
    return;
  }

  // Sorting logic tetap sama...
  entries.sort((a, b) => {
    if (a.name === "index") return -1;
    if (b.name === "index") return 1;
    return a.name.localeCompare(b.name);
  });

  for (const entry of entries) {
    // 3. Bangun URL Import menggunakan URL API yang berbasis import.meta.url
    // Jangan pakai "file:///src" + cwd
    const candidate = new URL(`./${entry.name}/mod.ts`, baseModuleUrl).href;

    debug(`[Loader] Importing module: ${candidate}`);
    try {
      const mod = await import(candidate);

      if (mod.default) {
        app.use(mod.default);
        console.log(`✅ Registered default export from ${entry.name}/mod.ts`);
      } else if (mod[entry.name]) {
        app.use(mod[entry.name]);
        console.log(
          `✅ Registered ${entry.name} export from ${entry.name}/mod.ts`,
        );
      } else {
        console.warn(`⚠️ No valid export found in ${entry.name}/mod.ts`);
      }
    } catch (err) {
      const error = err as Error & { code?: string };
      if (
        error.code === "ERR_MODULE_NOT_FOUND" ||
        error.message?.includes("Module not found")
      ) {
        debug(`[Loader] Module not found: ${candidate}`);
      } else {
        console.error(`[Loader] Failed to import ${candidate}:`, err);
      }
    }
  }
}
