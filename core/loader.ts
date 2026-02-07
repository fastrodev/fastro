import type { Middleware } from "./types.ts";

/**
 * Scans the `modules/` directory and automatically registers middleware files.
 *
 * This powerful feature allows you to structure your app into directories.
 * Any directory under `modules/` with a `mod.ts` file will be automatically loaded.
 *
 * Special Rules:
 * - `index` directory is loaded first.
 * - `profile` directory is loaded last.
 * - Others are loaded alphabetically.
 *
 * Each `mod.ts` should either `export default` a middleware or export a
 * named middleware matching the directory name.
 *
 * @example
 * ```ts
 * await autoRegisterModules(server);
 * ```
 *
 * @param app The app instance (server) to register middlewares on.
 */
export async function autoRegisterModules(
  app: { use: (middleware: Middleware) => void },
  modulesDirParam?: URL,
) {
  const modulesDir = modulesDirParam ?? new URL("../modules/", import.meta.url);
  const entries: Deno.DirEntry[] = [];

  for await (const entry of Deno.readDir(modulesDir)) {
    if (entry.isDirectory) {
      entries.push(entry);
    }
  }

  entries.sort((a, b) => {
    if (a.name === "index") return -1;
    if (b.name === "index") return 1;
    if (a.name === "profile") return 1;
    if (b.name === "profile") return -1;
    return a.name.localeCompare(b.name);
  });

  for (const entry of entries) {
    const modPath = new URL(`${entry.name}/mod.ts`, modulesDir).href;

    try {
      const mod = await import(modPath);

      if (mod.default) {
        app.use(mod.default);
        console.log(`Registered default export from ${entry.name}/mod.ts`);
      } else if (mod[entry.name]) {
        app.use(mod[entry.name]);
        console.log(
          `Registered ${entry.name} export from ${entry.name}/mod.ts`,
        );
      } else {
        console.warn(
          `No valid export found in ${entry.name}/mod.ts to register.`,
        );
      }
    } catch (err) {
      const e = err as Error & { code?: string };
      if (e.code === "ERR_MODULE_NOT_FOUND") {
        continue;
      }
      console.error(`autoRegisterModules: failed to import ${modPath}:`, err);
    }
  }
}
