import type { Context, Middleware, Next, Server } from "./types.ts";
// NOTE:
// We avoid statically importing `../manifest.ts` so this module can be reused
// from other projects. Consumers can either pass an explicit manifest object
// (useful for sync callers/tests) or let the loader dynamically import
// `<project-root>/manifest.ts` at runtime (async) using `Deno.cwd()`.

// Lightweight alias for the app shape expected by the loader.
export type App = {
  use: (middleware: Middleware) => void;
} & Partial<Server>;

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
  // When true, modules will only be registered as global middleware when they
  // explicitly export `global = true`. Defaults to `false` for backward
  // compatibility.
  requireExplicitGlobals?: boolean;
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
  options?: AutoRegisterOptions,
) {
  // Clear module-level registry for this run and record mounts for summary.
  _registeredMounts.length = 0;
  const names = sortNames(Object.keys(manifestObj));
  for (const name of names) {
    const ns = manifestObj[name];
    if (isNamespaceObject(ns)) {
      registerFromNamespace(name, ns as Record<string, unknown>, app, options);
    }
  }

  // Startup summary: list registered mounts and middleware/route counts
  try {
    const regs = _getRegisteredMounts();
    if (regs.length) {
      console.info(
        `ℹ️  [Loader] Registered ${regs.length} module(s): ${
          regs.map((r) => `${r.name} @ ${r.mount}`).join(", ")
        }`,
      );
    } else {
      console.info("ℹ️  [Loader] No modules registered by loader");
    }

    // If the app exposes middleware/route introspection, include counts.
    const mwCount = typeof (app as App & { _getMiddlewareCount?: () => number })
        ._getMiddlewareCount === "function"
      ? (app as App & { _getMiddlewareCount?: () => number })
        ._getMiddlewareCount?.()
      : undefined;
    const routePaths = typeof (app as App & { _getRoutePaths?: () => string[] })
        ._getRoutePaths === "function"
      ? (app as App & { _getRoutePaths?: () => string[] })._getRoutePaths?.()
      : undefined;

    if (typeof mwCount === "number") {
      console.info(`ℹ️  [Loader] Global middlewares: ${mwCount}`);
    }
    if (Array.isArray(routePaths)) {
      console.info(`ℹ️  [Loader] Registered route(s): ${routePaths.length}`);
    }
  } catch {
    // Non-fatal: logging should not break app startup
  }
}

/**
 * Exported helper to register a single namespace. Exported for testing.
 */
export function registerFromNamespace(
  name: string,
  ns: Record<string, unknown>,
  app: App,
  options?: AutoRegisterOptions,
) {
  const foundCandidate = getRegistrationCandidate(name, ns);
  let candidate: Middleware | null = foundCandidate as unknown as
    | Middleware
    | null;

  function normalizeMount(p: string) {
    if (p === "") return p;
    // strip trailing slashes but preserve leading // when present
    p = p.replace(/\/+$/g, "");
    if (!p.startsWith("/")) p = "/" + p;
    return p;
  }

  // Normalization used for recording mounts in startup summary. This
  // collapses multiple leading slashes into a single leading slash so
  // recorded mount strings are presentation-friendly.
  function normalizeMountForRecord(p: string) {
    if (p === "") return p;
    p = p.replace(/^\/+/, "/");
    p = p.replace(/\/+$/g, "");
    if (!p.startsWith("/")) p = "/" + p;
    return p;
  }

  function slugFromName(n: string) {
    return (
      n
        .toLowerCase()
        .replace(/[_\s]+/g, "-")
        .replace(/[^a-z0-9\-]/g, "")
        .replace(/^-+|-+$/g, "") || n
    );
  }

  // Helper to provide a tiny registrar wrapper for registration functions.
  const makeRegistrar = (base: App) => {
    const methods = [
      "get",
      "post",
      "put",
      "delete",
      "patch",
      "head",
      "options",
    ];
    const reg: Record<string, unknown> = {
      use: base.use,
      serve: (base as App).serve,
    };
    for (const m of methods) {
      const fn = (base as unknown as Record<string, unknown>)[m];
      reg[m] = (...args: unknown[]) => {
        if (typeof fn === "function") {
          try {
            (fn as unknown as (...a: unknown[]) => unknown).call(base, ...args);
          } catch {
            // ignore individual call errors
          }
          try {
            const p = String(args[0] ?? "");
            // Avoid registering a wildcard for the root mount (`/`) because
            // that would match all subpaths (e.g. `/index`) and shadow
            // explicit module mounts. Preserve behavior for empty-string
            // mounts which are expected to register `""` and `"/*"`.
            // Only add a wildcard registration when:
            // - the mount is not the root (`/`) which would shadow subpaths
            // - the provided mount does not already contain a wildcard
            // Preserve behavior for empty-string mounts (they should still
            // receive `"/*"`).
            if (p !== "/" && !p.includes("*")) {
              const normalized = p.replace(/\/+$/g, "");
              const wildcard = `${normalized}/*`;
              (fn as unknown as (...a: unknown[]) => unknown).call(
                base,
                wildcard,
                ...args,
              );
            }
          } catch {
            // ignore
          }
          return;
        }

        // If the base server doesn't implement the HTTP method, but does
        // expose `use`, fall back to registering the handler as global
        // middleware. This simulates legacy behavior and allows tests to
        // surface errors from `app.use` when appropriate. Errors from
        // `app.use` should propagate to the caller.
        if (typeof (base as App).use === "function") {
          const handler = args.find((a) => typeof a === "function") as
            | Middleware
            | undefined;
          if (handler) {
            (base as App).use(handler);
          }
        }
      };
    }
    return reg;
  };

  // Prefer module-level registration functions when provided. Detect a
  // registration hook as a function accepting exactly one argument (`app`).
  // This avoids misidentifying middleware functions (which take 3 args).
  if (
    typeof ns.default === "function" &&
    (ns.default as (app: App) => void).length === 1
  ) {
    try {
      const wrappedApp = makeRegistrar(app) as unknown as App;
      const originalUse = wrappedApp.use;
      wrappedApp.use = (mw: Middleware) => {
        const wrappedMw: Middleware = (req, ctx, next) => {
          if (!ctx.state) ctx.state = {};
          ctx.state.module = name;
          return mw(req, ctx, next);
        };
        return originalUse.call(wrappedApp, wrappedMw);
      };
      (ns.default as (app: App) => void)(wrappedApp);
      // Determine the recorded mount in a clearer, test-friendly way
      let recordedMount: string;
      if (typeof ns.mountPath === "string") {
        const mp = ns.mountPath as string;
        if (mp.includes("/") || mp === "") {
          recordedMount = normalizeMountForRecord(mp);
        } else {
          recordedMount = mp;
        }
      } else {
        recordedMount = name === "index" ? "/" : `/${name}`;
      }

      _registeredMounts.push({ name, mount: recordedMount });
      console.info(`✅ Registered module ${name} via registration function`);
      return true;
    } catch (e) {
      console.error(
        `❌ Registration function for ${name} threw:`,
        (e as Error).message,
      );
      // Propagate the error so callers (like autoRegisterModules) can
      // detect and handle manifest-level failures.
      throw e;
    }
  }

  // Support named `register` export: `export function register(app) {}`
  if (typeof ns.register === "function") {
    try {
      const wrappedApp = makeRegistrar(app) as unknown as App;
      const originalUse = wrappedApp.use;
      wrappedApp.use = (mw: Middleware) => {
        const wrappedMw: Middleware = (req, ctx, next) => {
          if (!ctx.state) ctx.state = {};
          ctx.state.module = name;
          return mw(req, ctx, next);
        };
        return originalUse.call(wrappedApp, wrappedMw);
      };
      (ns.register as (app: App) => void)(wrappedApp);
      {
        let recordedMount: string;
        if (typeof ns.mountPath === "string") {
          const mp = ns.mountPath as string;
          if (mp.includes("/") || mp === "") {
            recordedMount = normalizeMountForRecord(mp);
          } else {
            recordedMount = mp;
          }
        } else {
          recordedMount = name === "index" ? "/" : `/${name}`;
        }
        _registeredMounts.push({ name, mount: recordedMount });
      }
      console.info(`✅ Registered module ${name} via named register()`);
      return true;
    } catch (err) {
      console.error(
        `❌ Named register for ${name} threw:`,
        (err as Error).message,
      );
    }
  }

  // Support default export object with a `register(app)` method
  if (
    ns.default && typeof ns.default === "object" &&
    typeof (ns.default as { register?: (app: App) => void }).register ===
      "function"
  ) {
    try {
      const wrappedApp = makeRegistrar(app) as unknown as App;
      const originalUse = wrappedApp.use;
      wrappedApp.use = (mw: Middleware) => {
        const wrappedMw: Middleware = (req, ctx, next) => {
          if (!ctx.state) ctx.state = {};
          ctx.state.module = name;
          return mw(req, ctx, next);
        };
        return originalUse.call(wrappedApp, wrappedMw);
      };
      (ns.default as { register: (app: App) => void }).register(
        wrappedApp,
      );
      {
        let recordedMount: string;
        if (typeof ns.mountPath === "string") {
          const mp = ns.mountPath as string;
          if (mp.includes("/") || mp === "") {
            recordedMount = normalizeMountForRecord(mp);
          } else {
            recordedMount = mp;
          }
        } else {
          recordedMount = name === "index" ? "/" : `/${name}`;
        }
        _registeredMounts.push({ name, mount: recordedMount });
      }
      console.info(`✅ Registered module ${name} via default.register()`);
      return true;
    } catch (err) {
      console.error(
        `❌ default.register for ${name} threw:`,
        (err as Error).message,
      );
    }
  }

  // Support default export object with a `build()` method that returns middleware
  if (
    ns.default && typeof ns.default === "object" &&
    typeof (ns.default as { build?: () => unknown }).build === "function"
  ) {
    try {
      const built = (ns.default as { build?: () => unknown }).build?.();
      if (typeof built === "function") {
        // Use the built middleware as the registration candidate
        candidate = built as unknown as Middleware;
      }
    } catch {
      // ignore and fall back to regular candidate resolution
    }
  }

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

  // Determine mounting behavior:
  // - If module explicitly exports `global === true`, register as global middleware.
  // - If module exports `mountPath` (string), use that mount.
  // - Otherwise derive a sensible default mount from the folder `name`.
  const explicitGlobal = ns.global === true;
  const explicitMount = typeof ns.mountPath === "string" ? ns.mountPath : null;
  const _requireExplicit = !!options?.requireExplicitGlobals;

  const mount = explicitMount !== null
    ? normalizeMount(explicitMount)
    : (name === "index" ? "/" : `/${slugFromName(name)}`);

  // Decide registration strategy:
  // Only register global middleware when the module explicitly exports
  // `global === true`. This prevents router middlewares from being
  // auto-registered as globals and disables accidental fast-path loss.
  if (explicitGlobal) {
    app.use(wrapped);
  } else if (typeof app.get === "function") {
    // Register route-scoped handlers for exact path and wildcard subpaths.
    try {
      const handlerWrapper = (
        req: Request,
        ctx?: Context,
        next?: Next,
      ) => {
        const ctxArg = ctx ?? ({ state: {} } as Context);
        return (wrapped as Middleware)(
          req,
          ctxArg,
          next ?? (() => new Response("Not found", { status: 404 })),
        );
      };
      // If mounting at root, attach a noop route middleware so the server does
      // not attempt the fast-root optimization which uses a special `next()`
      // that throws when called. The noop preserves `next()` semantics for
      // router middlewares while keeping registration route-scoped.
      const noopMw = (_r: Request, _c: Context, n: Next) => n();
      // Register the handler for all supported HTTP methods exposed by the
      // router. This ensures modules receive requests for POST/PUT/etc and
      // not only GET. For root mounts we attach a noop middleware as the
      // last argument so `next()` semantics are preserved for router
      // middlewares and the server's fast-root behavior isn't confused.
      const methods = [
        "get",
        "post",
        "put",
        "delete",
        "patch",
        "head",
        "options",
      ];

      for (const m of methods) {
        const fn = (app as unknown as Record<string, unknown>)[m];
        if (typeof fn !== "function") continue;
        try {
          const f = fn as unknown as (
            this: unknown,
            ...args: unknown[]
          ) => unknown;
          if (mount === "/") {
            f.call(app, mount, handlerWrapper, noopMw);
            f.call(app, `${mount}/*`, handlerWrapper, noopMw);
          } else {
            f.call(app, mount, handlerWrapper);
            f.call(app, `${mount}/*`, handlerWrapper);
          }
        } catch {
          // If a particular method registration fails, continue to the next
          // method instead of aborting the whole registration process.
        }
      }
    } catch {
      // Fallback to global use if router API is not available or fails.
      app.use(wrapped);
    }
  } else {
    // No router API available; fall back to global middleware.
    app.use(wrapped);
  }

  if (candidate === ns.default) {
    console.info(
      `✅ Registered default export from ${name}/mod.ts at ${mount}`,
    );
  } else {
    console.info(
      `✅ Registered ${name} export from ${name}/mod.ts at ${mount}`,
    );
  }
  // Record mount for startup summary
  _registeredMounts.push({ name, mount });
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

// Internal registry for mounts recorded during auto-registration runs.
const _registeredMounts: Array<{ name: string; mount: string }> = [];

export function _getRegisteredMounts() {
  return _registeredMounts.slice();
}
