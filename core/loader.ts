import type { Middleware } from "./types.ts";
import * as manifest from "../manifest.ts";

// Lightweight alias for the app shape expected by the loader.
export type App = { use: (middleware: Middleware) => void };

/**
 * Sort module names for deterministic registration order.
 * - `index` is sorted first
 * - `profile` is sorted last
 * - all other names are sorted alphabetically
 *
 * @param names - Array of module names to sort
 * @returns The sorted array (same instance)
 */
export function sortComparator(a: string, b: string) {
  function weight(s: string) {
    if (s === "index") {
      return -1;
    }
    if (s === "profile") {
      return 1;
    }
    return 0;
  }

  const wa = weight(a);
  const wb = weight(b);

  if (wa !== wb) {
    return wa - wb;
  }

  return a.localeCompare(b);
}

export function sortNames(names: string[]) {
  return names.sort(sortComparator);
}

/**
 * Auto-register modules declared in `manifest.ts` on the provided app.
 *
 * This function uses the statically-imported `manifest.ts` so bundlers
 * (like Deno Deploy) include module bundles referenced by the manifest.
 *
 * @param app - The application object exposing a `use(middleware)` method
 */
export function autoRegisterModules(app: App) {
  // Reuse the core registration logic via the injectable helper so tests
  // can provide a synthetic manifest object and exercise all branches.
  try {
    autoRegisterModulesFrom(manifest as unknown as Record<string, unknown>, app);
  } catch (err) {
    console.error(
      "❌ [Loader] Failed reading manifest:",
      (err as Error).message,
    );
  }
}

/**
 * Auto-register modules from an explicit manifest object.
 *
 * This helper contains the real registration logic and is exported so tests
 * can pass a synthetic manifest to exercise all internal branches.
 */
export function autoRegisterModulesFrom(
  manifestObj: Record<string, unknown>,
  app: App,
) {
  const names = sortNames(Object.keys(manifestObj));
  for (const name of names) {
    const ns = manifestObj[name];
    if (isNamespaceObject(ns)) {
      registerFromNamespace(name, ns as Record<string, unknown>, app);
    }
  }
}

/**
 * Exported helper to register a single namespace. Exported for testing.
 */
export function registerFromNamespace(
  name: string,
  ns: Record<string, unknown>,
  app: App,
) {
  const candidate = getRegistrationCandidate(name, ns);
  if (!candidate) return false;
  app.use(candidate as unknown as Middleware);
  if (candidate === ns.default) {
    console.info(`✅ Registered default export from ${name}/mod.ts`);
  } else {
    console.info(`✅ Registered ${name} export from ${name}/mod.ts`);
  }
  return true;
}

export function isNamespaceObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object";
}

export function getRegistrationCandidate(
  name: string,
  ns: Record<string, unknown>,
) {
  const def = ns.default as unknown;
  if (typeof def === "function") return def;
  const named = ns[name];
  if (typeof named === "function") return named;
  return null;
}
