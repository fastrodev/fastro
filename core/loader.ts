import type { Middleware } from "./types.ts";
import * as manifest from "../manifest.ts";

/**
 * Sort module names for deterministic registration order.
 * - `index` is sorted first
 * - `profile` is sorted last
 * - all other names are sorted alphabetically
 *
 * @param names - Array of module names to sort
 * @returns The sorted array (same instance)
 */
export const sortNames = (names: string[]) =>
  names.sort((a, b) => {
    if (a === "index") return -1;
    if (b === "index") return 1;
    if (a === "profile") return 1;
    if (b === "profile") return -1;
    return a.localeCompare(b);
  });

/**
 * Auto-register modules declared in `manifest.ts` on the provided app.
 *
 * This function uses the statically-imported `manifest.ts` so bundlers
 * (like Deno Deploy) include module bundles referenced by the manifest.
 *
 * @param app - The application object exposing a `use(middleware)` method
 */
export function autoRegisterModules(app: { use: (middleware: Middleware) => void }) {
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
    return false;
  };

  try {
    const names = sortNames(Object.keys(manifest));
    for (const name of names) {
      const ns = (manifest as Record<string, unknown>)[name];
      if (ns && typeof ns === "object") {
        registerFromNamespace(name, ns as Record<string, unknown>);
      }
    }
  } catch (err) {
    console.error(
      "❌ [Loader] Failed reading manifest:",
      (err as Error).message,
    );
  }
}
