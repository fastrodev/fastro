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
  const isDeploy = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
  const isDebug = Deno.env.get("FASTRO_LOG_LOADER") === "true";
  const debug = (...args: unknown[]) => {
    if (isDeploy || isDebug) console.log(...args);
  };

  const cwd = Deno.cwd();
  debug(`[Loader] Current working directory: ${cwd}`);
  debug(`[Loader] import.meta.url: ${import.meta.url}`);

  let modulesDir: URL | string;
  if (modulesDirParam) {
    modulesDir = modulesDirParam;
    debug(`[Loader] Using provided modulesDirParam: ${modulesDir}`);
  } else {
    // Try to find modules folder relative to CWD first
    const pathFromCwd = join(cwd, "modules");
    debug(`[Loader] Checking directory at: ${pathFromCwd}`);
    try {
      const stats = Deno.statSync(pathFromCwd);
      if (stats.isDirectory) {
        modulesDir = pathFromCwd;
        debug(`[Loader] Found modules directory at CWD: ${modulesDir}`);
      } else {
        modulesDir = new URL("../modules/", import.meta.url);
        debug(
          `[Loader] Not a directory, falling back to import.meta.url: ${modulesDir}`,
        );
      }
    } catch (err) {
      modulesDir = new URL("../modules/", import.meta.url);
      debug(
        `[Loader] Stat failed, falling back to import.meta.url: ${modulesDir}`,
      );
      debug(`[Loader] Stat error: ${err}`);
    }
  }

  const toFileUrl = (value: string | URL) => {
    if (value instanceof URL) return value;
    if (value.startsWith("file://")) return new URL(value);
    return new URL(value, `file://${cwd}/`);
  };

  const ensureTrailingSlash = (url: URL) => {
    if (url.pathname.endsWith("/")) return url;
    const base = `${url.protocol}//${url.host}`;
    return new URL(`${url.pathname}/`, base);
  };

  const modulesDirUrl = ensureTrailingSlash(toFileUrl(modulesDir));
  debug(`[Loader] Resolved modules base URL: ${modulesDirUrl.href}`);

  const entries: Deno.DirEntry[] = [];

  try {
    debug(`[Loader] Reading directory entries from: ${modulesDir}`);
    for await (const entry of Deno.readDir(modulesDir)) {
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
      `[Loader] autoRegisterModules: failed to read ${modulesDir}:`,
      err,
    );
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
    const canonicalPath = new URL(`${entry.name}/mod.ts`, modulesDirUrl).href;
    const fallbackPath =
      new URL(`../modules/${entry.name}/mod.ts`, import.meta.url).href;
    const candidates = canonicalPath === fallbackPath
      ? [canonicalPath]
      : [canonicalPath, fallbackPath];

    let registered = false;
    for (const candidate of candidates) {
      debug(`[Loader] Importing module: ${candidate}`);
      try {
        const mod = await import(candidate);

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

        registered = true;
        break;
      } catch (err) {
        const error = err as Error & { code?: string };
        if (
          error.code === "ERR_MODULE_NOT_FOUND" ||
          error.message?.includes("Module not found")
        ) {
          debug(`[Loader] Module not found: ${candidate}`);
          continue;
        }

        console.error(`[Loader] Failed to import ${candidate}:`, err);
        registered = true;
        break;
      }
    }

    if (!registered) {
      debug(`
        [Loader] Skipping registration for ${entry.name}; no path matched
      `.trim());
    }
  }
}
