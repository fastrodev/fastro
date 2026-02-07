/* c8 ignore file */
import { join } from "@std/path";
import type { Middleware } from "./types.ts";

/**
 * Otomatis meregistrasi modul dari direktori tertentu.
 * Dioptimalkan untuk lingkungan Deno Deploy.
 */
export async function autoRegisterModules(
  app: { use: (middleware: Middleware) => void },
  modulesDirParam?: string,
) {
  const isDeploy = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
  const isDebug = Deno.env.get("FASTRO_LOG_LOADER") === "true";
  const debug = (...args: unknown[]) => {
    if (isDeploy || isDebug) console.log(...args);
  };

  const cwd = Deno.cwd();
  debug(`[Loader] Current working directory: ${cwd}`);
  debug(`[Loader] import.meta.url: ${import.meta.url}`);

  // 1. Tentukan path fisik untuk Deno.readDir (menggunakan string path)
  // Di Deno Deploy, folder project biasanya ada di /src
  const modulesPath = modulesDirParam || join(cwd, "modules");
  debug(`[Loader] Reading directory entries from: ${modulesPath}`);

  const entries: Deno.DirEntry[] = [];
  try {
    for await (const entry of Deno.readDir(modulesPath)) {
      if (entry.isDirectory) {
        entries.push(entry);
      }
    }
  } catch (err) {
    console.error(`[Loader] Failed to read directory ${modulesPath}:`, err);
    return;
  }

  // Sorting: index diutamakan, profile terakhir
  entries.sort((a, b) => {
    if (a.name === "index") return -1;
    if (b.name === "index") return 1;
    if (a.name === "profile") return 1;
    if (b.name === "profile") return -1;
    return a.name.localeCompare(b.name);
  });

  debug(`[Loader] Found modules: ${entries.map((e) => e.name).join(", ")}`);

  for (const entry of entries) {
    /**
     * 2. SOLUSI UTAMA: Gunakan URL relatif terhadap file loader ini.
     * Jika loader.ts ada di /src/core/loader.ts, maka kita naik satu level
     * untuk mencapai /src/modules/.
     */
    const candidate =
      new URL(`../modules/${entry.name}/mod.ts`, import.meta.url).href;

    debug(`[Loader] Importing module: ${candidate}`);

    try {
      // Dynamic import menggunakan URL specifier yang valid
      const mod = await import(candidate);

      if (mod.default) {
        app.use(mod.default);
        debug(`[Loader] ✅ Registered default export: ${entry.name}`);
      } else if (mod[entry.name]) {
        app.use(mod[entry.name]);
        debug(`[Loader] ✅ Registered named export: ${entry.name}`);
      } else {
        console.warn(
          `[Loader] ⚠️ No valid export found in ${entry.name}/mod.ts`,
        );
      }
    } catch (err) {
      const error = err as Error & { code?: string };
      // Cek jika modul memang tidak ada
      if (
        error.code === "ERR_MODULE_NOT_FOUND" ||
        error.message?.includes("Module not found")
      ) {
        debug(`[Loader] ❌ Module not found at: ${candidate}`);
      } else {
        console.error(`[Loader] 🚨 Error importing ${candidate}:`, err);
      }
    }
  }
}
