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

function applyMiddlewares(
  req: Request,
  context: Context,
  finalHandler: () => Response | Promise<Response>,
  list: Middleware[],
): Response | Promise<Response> {
  let index = 0;
  const dispatch = (): Response | Promise<Response> => {
    if (index >= list.length) return finalHandler();
    return list[index++](req, context, dispatch);
  };
  return dispatch();
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
          return toResponse(res);
        }

        return applyMiddlewares(
          req,
          context,
          () => {
            const res = route.handler(req, context, next);
            if (res instanceof Response) return res;
            if (typeof res === "string") return new Response(res);
            return toResponse(res);
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
  routes.push({
    method,
    pattern,
    handler,
    paramNames: extractParamNames(path),
    middlewares: routeMiddlewares,
  });
  if (typeof path === "string") {
    routePaths.push(path);
  } else {
    const p = (path as URLPattern).pathname;
    routePaths.push(typeof p === "string" ? p : "");
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
          : rootHandler!(req, {
            params: emptyParams,
            query: emptyQuery,
            remoteAddr: info.remoteAddr,
            get url() {
              return new URL(urlStr);
            },
            renderToString: Object.assign(
              (_component: unknown, _opts?: unknown) => {
                console.warn(
                  "renderToString called but createRenderMiddleware is not installed. Install it with app.use(createRenderMiddleware()) to enable rendering.",
                );
                return "<!-- renderToString: render middleware not installed -->";
              },
              { __is_stub: true },
            ) as unknown,
          } as unknown as Context, rootNext);
        if (res instanceof Response) return res;
        if (typeof res === "string") return new Response(res);
        return toResponse(res);
      }
    }

    const cacheKey = method + ":" + urlStr;
    const cached = matchCache.get(cacheKey);

    if (cached !== undefined && !hasGlobalMiddlewares) {
      if (cached === null) return new Response("Not found", { status: 404 });

      // Move to end (LRU)
      matchCache.delete(cacheKey);
      matchCache.set(cacheKey, cached);

      const route = routes[cached.routeIndex];
      if (route.middlewares.length === 0) {
        const cachedCtx = {
          params: cached.params,
          query: cached.query,
          remoteAddr: info.remoteAddr,
          get url() {
            return new URL(urlStr);
          },
          renderToString: Object.assign(
            (_component: unknown, _opts?: unknown) => {
              console.warn(
                "renderToString called but createRenderMiddleware is not installed. Install it with app.use(createRenderMiddleware()) to enable rendering.",
              );
              return "<!-- renderToString: render middleware not installed -->";
            },
            { __is_stub: true },
          ) as unknown,
        } as unknown as Context;
        const res = route.handler(req, cachedCtx, () =>
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
          ));
        if (res instanceof Response) return res;
        if (typeof res === "string") return new Response(res);
        return toResponse(res);
      }
    }

    const url = qIdx !== -1 ? new URL(urlStr) : undefined;
    const ctx: Context = {
      params: emptyParams,
      get query() {
        if (!url) return emptyQuery;
        const q: Record<string, string> = {};
        for (const [k, v] of url.searchParams) q[k] = v;
        return q;
      },
      remoteAddr: info.remoteAddr,
      get url() {
        return url || new URL(urlStr);
      },
      // Default stub: warn when called so developers know to install render middleware.
      renderToString: Object.assign(
        (_component: unknown, _opts?: unknown) => {
          console.warn(
            "renderToString called but createRenderMiddleware is not installed. Install it with app.use(createRenderMiddleware()) to enable rendering.",
          );
          return "<!-- renderToString: render middleware not installed -->";
        },
        { __is_stub: true },
      ) as unknown,
    } as unknown as Context;

    const runFinal = () => {
      if (cached !== undefined) {
        if (cached === null) return new Response("Not found", { status: 404 });

        // Move to end (LRU)
        matchCache.delete(cacheKey);
        matchCache.set(cacheKey, cached);

        const route = routes[cached.routeIndex];
        ctx.params = cached.params;
        const next = () =>
          tryRoute(
            cached.routeIndex + 1,
            ctx,
            url,
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
          const res = route.handler(req, ctx, next);
          if (res instanceof Response) return res;
          if (typeof res === "string") return new Response(res);
          return toResponse(res);
        }
        return applyMiddlewares(
          req,
          ctx,
          () => {
            const res = route.handler(req, ctx, next);
            if (res instanceof Response) return res;
            if (typeof res === "string") return new Response(res);
            return toResponse(res);
          },
          route.middlewares,
        );
      }
      return tryRoute(
        0,
        ctx,
        url,
        req,
        urlStr,
        pathname,
        cacheKey,
        method,
        matchCache,
        MAX_CACHE_SIZE,
        routeRegex,
      );
    };

    return middlewares.length === 0
      ? runFinal()
      : applyMiddlewares(req, ctx, runFinal, middlewares);
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

// Test-only helper: execute internal code paths to increase coverage for branches
// that are difficult to reach via regular HTTP requests. Only used by tests.
// Note: test-only helpers were removed to keep production code clean.

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
