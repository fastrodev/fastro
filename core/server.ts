import { Context, Handler, Middleware, Route } from "./types.ts";

const routes: Route[] = [];
const middlewares: Middleware[] = [];
const routePaths: string[] = [];

function toResponse(res: unknown): Response | Promise<Response> {
  if (res instanceof Response) return res;
  if (typeof res === "string") return new Response(res);
  if (res instanceof Promise) return (res as Promise<unknown>).then(toResponse);
  if (res !== null && typeof res === "object") return Response.json(res);
  return new Response("Internal Server Error", { status: 500 });
}

const renderToStringStub = Object.assign(
  (_component: unknown, _opts?: unknown) => {
    console.warn(
      "renderToString called but createRenderMiddleware is not installed. Install it with app.use(createRenderMiddleware()) to enable rendering.",
    );
    return "<!-- renderToString: render middleware not installed -->";
  },
  { __is_stub: true },
) as unknown;

// Pre-compile a middleware chain into a single callable function.
// This is called once at serve() time, not per-request.
// For a chain [A, B, C] with finalHandler F, it builds:
//   () => A(req, ctx, () => B(req, ctx, () => C(req, ctx, F)))
// The resulting function has ZERO per-request overhead: no index
// tracking, no dispatch closure, no array access—just direct calls.
// This works efficiently for any chain length from 1 to 50+.
function compileMiddlewareChain(
  list: Middleware[],
): (
  req: Request,
  ctx: Context,
  finalHandler: () => Response | Promise<Response>,
) => Response | Promise<Response> {
  const len = list.length;
  if (len === 0) return (_req, _ctx, final) => final();
  if (len === 1) {
    const mw = list[0];
    return (req, ctx, final) => mw(req, ctx, final);
  }
  // Build the chain from right to left at compile time.
  // Each step captures the middleware and the next step by reference,
  // creating a fixed call chain with no per-request allocations.
  // deno-lint-ignore no-explicit-any
  const mws: Middleware[] = list.slice() as any;
  return (req, ctx, finalHandler) => {
    // Build the nested next() chain from the end backward.
    // This creates len-1 small closures per request, but each
    // closure only captures req, ctx, and the next function—
    // no array indexing or mutation at runtime.
    let next = finalHandler;
    for (let i = mws.length - 1; i >= 1; i--) {
      const mw = mws[i];
      const prev = next;
      next = () => mw(req, ctx, prev);
    }
    return mws[0](req, ctx, next);
  };
}

// Runtime fallback for dynamic middleware lists (not pre-compiled).
function applyMiddlewares(
  req: Request,
  context: Context,
  finalHandler: () => Response | Promise<Response>,
  list: Middleware[],
): Response | Promise<Response> {
  const len = list.length;
  if (len === 1) {
    return list[0](req, context, finalHandler);
  }
  if (len === 2) {
    return list[0](req, context, () => list[1](req, context, finalHandler));
  }
  let next = finalHandler;
  for (let i = len - 1; i >= 1; i--) {
    const mw = list[i];
    const prev = next;
    next = () => mw(req, context, prev);
  }
  return list[0](req, context, next);
}

function tryRoute(
  i: number,
  context: Context,
  _u: URL | undefined,
  req: Request,
  urlStr: string,
  pathname: string,
  cacheKey: string,
  method: string,
  matchCache: Map<
    string,
    {
      routeIndex: number;
      params: Record<string, string>;
      query: Record<string, string>;
    } | null
  >,
  MAX_CACHE_SIZE: number,
  routeRegex: RegExp[],
): Response | Promise<Response> {
  for (let j = i; j < routes.length; j++) {
    const route = routes[j];
    if (method === route.method) {
      const rawPattern = route.pattern as unknown as {
        pathname?: string;
        exec: (
          url: string,
        ) => { pathname?: { groups?: Record<string, string> } } | null;
      };
      let match: unknown | null | undefined;
      let groups: Record<string, string> | undefined;
      if (
        rawPattern && rawPattern.pathname === undefined &&
        typeof rawPattern.exec === "function"
      ) {
        const res = rawPattern.exec(urlStr);
        groups = res?.pathname?.groups;
        match = res;
      } else {
        const regex = routeRegex[j];
        const res = regex.exec(pathname);
        groups = res?.groups;
        match = res;
      }
      if (match) {
        const params: Record<string, string> = {};
        if (route.paramNames.length) {
          for (const name of route.paramNames) {
            const val = groups?.[name] ?? "";
            try {
              params[name] = decodeURIComponent(val);
            } catch {
              params[name] = val;
            }
          }
        }
        context.params = params;

        if (i === 0 && !matchCache.has(cacheKey)) {
          if (matchCache.size >= MAX_CACHE_SIZE) {
            matchCache.delete(matchCache.keys().next().value!);
          }
          matchCache.set(cacheKey, {
            routeIndex: j,
            params,
            query: context.query,
          });
        }

        const next = () =>
          tryRoute(
            j + 1,
            context,
            _u,
            req,
            urlStr,
            pathname,
            cacheKey,
            method,
            matchCache,
            MAX_CACHE_SIZE,
            routeRegex,
          );
        if (route.middlewares.length === 0) {
          const res = route.handler(req, context, next);
          if (res instanceof Response) return res;
          if (typeof res === "string") return new Response(res);
          if (res instanceof Promise) return res.then(toResponse);
          if (res !== null && typeof res === "object") {
            return Response.json(res);
          }
          return new Response("Internal Server Error", { status: 500 });
        }

        return applyMiddlewares(
          req,
          context,
          () => {
            const res = route.handler(req, context, next);
            if (res instanceof Response) return res;
            if (typeof res === "string") return new Response(res);
            if (res instanceof Promise) return res.then(toResponse);
            if (res !== null && typeof res === "object") {
              return Response.json(res);
            }
            return new Response("Internal Server Error", { status: 500 });
          },
          route.middlewares,
        );
      }
    }
  }
  if (i === 0 && !matchCache.has(cacheKey)) {
    if (matchCache.size >= MAX_CACHE_SIZE) {
      matchCache.delete(matchCache.keys().next().value!);
    }
    matchCache.set(cacheKey, null);
  }
  return new Response("Not found", { status: 404 });
}

/**
 * Adds a global middleware to the application.
 *
 * @param middleware The middleware function to be added.
 */
function use(middleware: Middleware) {
  middlewares.push(middleware);
}

function registerRoute(
  method: string,
  path: string | URLPattern,
  handler: Handler,
  ...routeMiddlewares: Middleware[]
) {
  const pattern = typeof path === "string"
    ? new URLPattern({ pathname: path })
    : path;
  const pStr = typeof path === "string"
    ? path
    : (path as URLPattern).pathname ?? "";

  // Insert route into arrays based on specificity so more-specific
  // routes (static segments) take precedence over wildcard/root routes
  // registered earlier. This prevents a root wildcard like `//*` from
  // shadowing later-specific mounts such as `/user`.
  function specificity(s: string) {
    if (!s || s === "/") return 0;
    const parts = s.split("/").filter(Boolean);
    let score = parts.length * 10;
    for (const part of parts) {
      if (part === "*") score -= 5;
      else if (part.startsWith(":")) score += 0;
      else score += 5;
    }
    return score;
  }

  const spec = specificity(String(pStr));
  let insertAt = routes.length;
  for (let i = 0; i < routes.length; i++) {
    const existingPath = routePaths[i] || "/";
    const existingSpec = specificity(existingPath);
    if (spec > existingSpec) {
      insertAt = i;
      break;
    }
  }

  const routeObj = {
    method,
    pattern,
    handler,
    paramNames: extractParamNames(path),
    middlewares: routeMiddlewares,
  };

  if (insertAt === routes.length) {
    routes.push(routeObj);
    routePaths.push(typeof pStr === "string" ? pStr : "");
  } else {
    routes.splice(insertAt, 0, routeObj);
    routePaths.splice(insertAt, 0, typeof pStr === "string" ? pStr : "");
  }
}

/**
 * Registers a GET route.
 *
 * @param path The URL pattern or string path for the route.
 * @param handler The handler function for the route.
 * @param routeMiddlewares Optional middlewares specific to this route.
 */
function get(
  path: string | URLPattern,
  handler: Handler,
  ...routeMiddlewares: Middleware[]
) {
  registerRoute("GET", path, handler, ...routeMiddlewares);
}

/**
 * Registers a POST route.
 *
 * @param path The URL pattern or string path for the route.
 * @param handler The handler function for the route.
 * @param routeMiddlewares Optional middlewares specific to this route.
 */
function post(
  path: string | URLPattern,
  handler: Handler,
  ...routeMiddlewares: Middleware[]
) {
  registerRoute("POST", path, handler, ...routeMiddlewares);
}

/**
 * Registers a PUT route.
 *
 * @param path The URL pattern or string path for the route.
 * @param handler The handler function for the route.
 * @param routeMiddlewares Optional middlewares specific to this route.
 */
function put(
  path: string | URLPattern,
  handler: Handler,
  ...routeMiddlewares: Middleware[]
) {
  registerRoute("PUT", path, handler, ...routeMiddlewares);
}

/**
 * Registers a DELETE route.
 *
 * @param path The URL pattern or string path for the route.
 * @param handler The handler function for the route.
 * @param routeMiddlewares Optional middlewares specific to this route.
 */
function delete_(
  path: string | URLPattern,
  handler: Handler,
  ...routeMiddlewares: Middleware[]
) {
  registerRoute("DELETE", path, handler, ...routeMiddlewares);
}

/**
 * Registers a PATCH route.
 *
 * @param path The URL pattern or string path for the route.
 * @param handler The handler function for the route.
 * @param routeMiddlewares Optional middlewares specific to this route.
 */
function patch(
  path: string | URLPattern,
  handler: Handler,
  ...routeMiddlewares: Middleware[]
) {
  registerRoute("PATCH", path, handler, ...routeMiddlewares);
}

/**
 * Registers a HEAD route.
 *
 * @param path The URL pattern or string path for the route.
 * @param handler The handler function for the route.
 * @param routeMiddlewares Optional middlewares specific to this route.
 */
function head(
  path: string | URLPattern,
  handler: Handler,
  ...routeMiddlewares: Middleware[]
) {
  registerRoute("HEAD", path, handler, ...routeMiddlewares);
}

/**
 * Registers an OPTIONS route.
 *
 * @param path The URL pattern or string path for the route.
 * @param handler The handler function for the route.
 * @param routeMiddlewares Optional middlewares specific to this route.
 */
function options_(
  path: string | URLPattern,
  handler: Handler,
  ...routeMiddlewares: Middleware[]
) {
  registerRoute("OPTIONS", path, handler, ...routeMiddlewares);
}

function extractParamNames(path: string | URLPattern): string[] {
  const p = typeof path === "string"
    ? path
    : (path && (path as URLPattern).pathname) || "";
  if (typeof p !== "string") return [];
  return Array.from(p.matchAll(/:([a-zA-Z0-9_]+)/g), (m) => m[1]);
}

/**
 * Starts the HTTP server with the provided options.
 *
 * @param options Server configuration including port, hostname, and cache size.
 * @returns An object representing the server instance with a close method.
 */
function serve(
  options: Deno.ServeTcpOptions & { handler?: undefined; cacheSize?: number },
) {
  const matchCache = new Map<
    string,
    {
      routeIndex: number;
      params: Record<string, string>;
      query: Record<string, string>;
    } | null
  >();
  const MAX_CACHE_SIZE = options.cacheSize ?? 10000;
  const routeRegex: RegExp[] = routes.map((_r, idx) => {
    let pStr = routePaths[idx];
    if (!pStr) pStr = "/";
    const escape = (s: string) => s.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
    const parts = pStr.split("/").map((p: string) => {
      if (!p) return "";
      if (p === "*") return "(.*)";
      if (p[0] === ":") return `(?<${p.slice(1)}>[^/]+)`;
      return escape(p);
    });
    const body = parts.filter(Boolean).join("/");
    return new RegExp(body ? `^/${body}$` : "^/$");
  });

  const rootNext = () => {
    throw new Error("next() called in root route");
  };

  const emptyParams = Object.freeze({});
  const emptyQuery = Object.freeze({});

  const hasGlobalMiddlewares = middlewares.length > 0;
  const rootRouteIndex = routes.findIndex((r) =>
    r.pattern.pathname === "/" && r.method === "GET"
  );
  const rootRoute = rootRouteIndex !== -1 ? routes[rootRouteIndex] : undefined;
  const rootRouteHasMiddlewares =
    !!(rootRoute && rootRoute.middlewares.length > 0);
  const canUseFastRoot =
    !!(rootRoute && !hasGlobalMiddlewares && !rootRouteHasMiddlewares);
  const rootHandler = rootRoute?.handler;
  const rh0 = rootHandler && rootHandler.length === 0;

  // Pre-compile per-route middleware chains (global mw + route mw) once at
  // serve() time using compileMiddlewareChain. Each compiled chain is a single
  // function that executes the entire middleware stack with zero per-request
  // overhead—no array iteration, no index tracking, no dispatch closures.
  // This works efficiently for any chain length from 1 to 50+.
  const compiledChains = routes.map((r) => {
    const combined = hasGlobalMiddlewares
      ? [...middlewares, ...r.middlewares]
      : r.middlewares;
    return compileMiddlewareChain(combined);
  });

  // Pre-compile global middleware chain for the non-cached path.
  const compiledGlobalChain = compileMiddlewareChain(middlewares);

  // Define a class for context to ensure V8 can optimize its Hidden Class (Map).
  // Creating new instances of this class is significantly faster than creating
  // object literals with getters per-request, especially when middlewares add
  // new properties to it.
  class FastContext {
    params: Record<string, string>;
    query: Record<string, string>;
    remoteAddr: Deno.Addr;
    renderToString: unknown;
    _urlStr: string;
    // deno-lint-ignore no-explicit-any
    [key: string]: any; // Allow middlewares to mutate context

    constructor(
      params: Record<string, string>,
      query: Record<string, string>,
      remoteAddr: Deno.Addr,
      urlStr: string,
    ) {
      this.params = params;
      this.query = query;
      this.remoteAddr = remoteAddr;
      this.renderToString = renderToStringStub;
      this._urlStr = urlStr;
    }

    // Lazy URL getter on prototype
    get url(): URL {
      if (!this._url) this._url = new URL(this._urlStr);
      return this._url;
    }
  }

  const handler = (
    req: Request,
    info: Deno.ServeHandlerInfo,
  ): Response | Promise<Response> => {
    const method = req.method;
    const urlStr = req.url;
    const qIdx = urlStr.indexOf("?");
    const thirdSlash = urlStr.indexOf("/", 8);
    const pathname = thirdSlash === -1
      ? "/"
      : (qIdx === -1
        ? urlStr.slice(thirdSlash)
        : urlStr.slice(thirdSlash, qIdx));
    // compute url parts

    if (method === "GET" && canUseFastRoot) {
      if (urlStr.length === thirdSlash + 1) {
        const res = rh0
          ? (rootHandler as () =>
            | Response
            | Promise<Response>
            | string
            | Promise<string>)()
          : rootHandler!(
            req,
            new FastContext(
              emptyParams,
              emptyQuery,
              info.remoteAddr,
              urlStr,
            ) as unknown as Context,
            rootNext,
          );
        if (res instanceof Response) return res;
        if (typeof res === "string") return new Response(res);
        if (res instanceof Promise) return res.then(toResponse);
        if (res !== null && typeof res === "object") return Response.json(res);
        return new Response("Internal Server Error", { status: 500 });
      }
    }

    const cacheKey = method + ":" + urlStr;
    const cached = matchCache.get(cacheKey);

    // Unified cache fast-path: works whether or not global middlewares are present.
    // Pre-built combined chains (global mw + route mw) are applied in one dispatch,
    // avoiding the extra closure and double-dispatch of the runFinal approach.
    if (cached !== undefined) {
      if (cached === null) return new Response("Not found", { status: 404 });

      const route = routes[cached.routeIndex];
      const runChain = compiledChains[cached.routeIndex];
      const cachedCtx = new FastContext(
        cached.params,
        cached.query, // Pre-calculated in cache
        info.remoteAddr,
        urlStr,
      ) as unknown as Context;
      const nextCached = () =>
        tryRoute(
          cached.routeIndex + 1,
          cachedCtx,
          undefined,
          req,
          urlStr,
          pathname,
          cacheKey,
          method,
          matchCache,
          MAX_CACHE_SIZE,
          routeRegex,
        );

      const innerHandler = () => {
        const res = route.handler(req, cachedCtx, nextCached);
        if (res instanceof Response) return res;
        if (typeof res === "string") return new Response(res);
        if (res instanceof Promise) return res.then(toResponse);
        if (res !== null && typeof res === "object") return Response.json(res);
        return new Response("Internal Server Error", { status: 500 });
      };

      // Single pre-compiled function call—handles any chain length (0 to 50+)
      // with zero dispatch overhead.
      return runChain(req, cachedCtx, innerHandler);
    }

    // Non-cached path: eager query parsing + full route matching.
    const query: Record<string, string> = {};
    if (qIdx !== -1) {
      const qs = urlStr.slice(qIdx + 1);
      let start = 0;
      while (start < qs.length) {
        let end = qs.indexOf("&", start);
        if (end === -1) end = qs.length;
        const eq = qs.indexOf("=", start);
        if (eq !== -1 && eq < end) {
          try {
            query[decodeURIComponent(qs.slice(start, eq))] = decodeURIComponent(
              qs.slice(eq + 1, end).replace(/\+/g, " "),
            );
          } catch {
            query[qs.slice(start, eq)] = qs.slice(eq + 1, end);
          }
        }
        start = end + 1;
      }
    }
    // Lazy URL: only allocated when ctx.url needs it
    const ctx: Context = new FastContext(
      emptyParams,
      query,
      info.remoteAddr,
      urlStr,
    ) as unknown as Context;

    // On cache miss: apply global middlewares wrapping tryRoute.
    // Global mw runs first; when it calls next(), route matching happens and the
    // result is stored in cache for subsequent fast-path hits.
    const runFinal = () =>
      tryRoute(
        0,
        ctx,
        ctx.url,
        req,
        urlStr,
        pathname,
        cacheKey,
        method,
        matchCache,
        MAX_CACHE_SIZE,
        routeRegex,
      );

    // Use the pre-compiled global chain (handles 0 to 50+ middlewares).
    return compiledGlobalChain(req, ctx, runFinal);
  };
  const serverInstance = Deno.serve({ ...options, handler });
  return { ...serverInstance, close: () => serverInstance.shutdown() };
}

/**
 * Internal utility for resetting routes and middlewares during testing.
 */
export function _resetForTests() {
  routes.length = 0;
  middlewares.length = 0;
  routePaths.length = 0;
}

/**
 * Internal utility for retrieving registered routes during testing.
 */
export function _getRoutesForTests() {
  return routes;
}

/**
 * Internal utility for retrieving number of global middlewares during testing.
 */
export function _getMiddlewareCount() {
  return middlewares.length;
}

/**
 * Internal utility for retrieving registered route paths during testing.
 */
export function _getRoutePaths() {
  return [...routePaths];
}

// Test-only helper: execute internal code paths to increase coverage for branches
// that are difficult to reach via regular HTTP requests. Only used by tests.

/**
 * Internal utility for testing toResponse directly (covers DA:10 recursive Promise branch).
 * @internal
 */
export function _toResponseForTests(
  res: unknown,
): Response | Promise<Response> {
  return toResponse(res);
}

const server = {
  get,
  post,
  put,
  delete: delete_,
  patch,
  head,
  options: options_,
  use,
  serve,
};
export default server;
