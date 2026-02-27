import type { Middleware } from "./types.ts";
// NOTE:
// We avoid statically importing `../manifest.ts` so this module can be reused
// from other projects. Consumers can either pass an explicit manifest object
// (useful for sync callers/tests) or let the loader dynamically import
// `<project-root>/manifest.ts` at runtime (async) using `Deno.cwd()`.

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
export type AutoRegisterOptions = {
  // If provided, the loader will use this manifest object synchronously.
  manifest?: Record<string, unknown>;
  // If provided and `manifest` is not set, this path (absolute or file://)
  // will be dynamically imported. Defaults to `${Deno.cwd()}/manifest.ts`.
  manifestPath?: string;
};

/**
 * Auto-register modules declared in a project's `manifest.ts` on the provided
 * app.
 *
 * Two modes are supported:
 * - sync: pass `options.manifest` (a manifest object) and registration runs
 *   synchronously via `autoRegisterModulesFrom`.
 * - async: omit `options.manifest` and the loader will attempt to dynamically
 *   import the project's `manifest.ts` from `Deno.cwd()` (or `options.manifestPath`).
 *
 * This function is `async` to support the dynamic-import mode. Callers that
 * need synchronous registration should pass a manifest object and use the
 * `autoRegisterModulesFrom` helper directly.
 */
export async function autoRegisterModules(
  app: App,
  options?: AutoRegisterOptions,
) {
  // If a manifest object was provided, reuse the synchronous helper.
  if (options?.manifest) {
    try {
      autoRegisterModulesFrom(options.manifest, app);
    } catch (err) {
      console.error(
        "❌ [Loader] Failed reading manifest:",
        (err as Error).message,
      );
    }
    return;
  }

  // Otherwise attempt to dynamically import the manifest from the caller's
  // working directory. This allows projects that import this library to keep
  // a local `manifest.ts` at the project root and have it discovered.
  try {
    const basePath = options?.manifestPath ?? `${Deno.cwd()}/manifest.ts`;
    const url = basePath.startsWith("file://")
      ? basePath
      : `file://${basePath}`;
    const mod = await import(url);
    autoRegisterModulesFrom(mod as unknown as Record<string, unknown>, app);
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

  // Wrap the candidate middleware so auto-registered modules automatically
  // expose their module name on `ctx.state.module`. This allows render
  // middleware and handlers to infer the module (folder) without requiring
  // each module to manually set the value.
  const wrapped: Middleware = (req, ctx, next) => {
    if (!ctx.state) ctx.state = {};
    const prevModule = ctx.state.module;

    // Set module for this module's middleware so handlers/renderers
    // can rely on it while this middleware runs. If the module does not
    // handle the request and calls `next()`, restore the previous value.
    ctx.state.module = name;

    let restored = false;
    const restore = () => {
      if (restored) return;
      restored = true;
      if (prevModule === undefined) {
        delete ctx.state.module;
      } else {
        ctx.state.module = prevModule;
      }
    };

    const wrappedNext = () => {
      restore();
      return next();
    };

    try {
      const res = (candidate as unknown as Middleware)(req, ctx, wrappedNext) as
        | Response
        | Promise<Response>;

      // If candidate returned a promise, ensure we restore when it settles.
      if (res && typeof (res as Promise<Response>).then === "function") {
        return (res as Promise<Response>).then((v) => {
          restore();
          return v;
        }, (err) => {
          restore();
          throw err;
        });
      }

      // Synchronous result — ensure restoration in case wrappedNext wasn't used.
      restore();
      return res;
    } catch (err) {
      // Ensure restoration on synchronous throw
      restore();
      throw err;
    }
  };

  app.use(wrapped as unknown as Middleware);

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
