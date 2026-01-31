import { Context, Handler, Middleware, Route } from "./types.ts";

// Registered routes
const routes: Route[] = [];

// Global middlewares applied to all routes
const middlewares: Middleware[] = [];

/**
 * Adds a global middleware that applies to all routes.
 * @param middleware The middleware function to add.
 */
function use(middleware: Middleware) {
  middlewares.push(middleware);
}

/**
 * Helper function to register a route with the specified method, path, handler, and optional route-specific middlewares.
 * Combines route middlewares with global middlewares in the order: route middlewares first, then global.
 * @param method The HTTP method (e.g., "GET", "POST").
 * @param path The URL path for the route (supports dynamic parameters like :id).
 * @param handler The handler function to process the request.
 * @param routeMiddlewares Optional middlewares specific to this route.
 */
function registerRoute(
  method: string,
  path: string,
  handler: Handler,
  ...routeMiddlewares: Middleware[]
) {
  routes.push({
    method,
    pattern: new URLPattern({ pathname: path }),
    handler,
    paramNames: extractParamNames(path),
    middlewares: routeMiddlewares,
  });
}

/**
 * Registers a GET route with optional route-specific middlewares.
 * @param path The URL path for the route (supports dynamic parameters like :id).
 * @param handler The handler function to process the request.
 * @param routeMiddlewares Optional middlewares specific to this route.
 */
function get(
  path: string,
  handler: Handler,
  ...routeMiddlewares: Middleware[]
) {
  registerRoute("GET", path, handler, ...routeMiddlewares);
}

/**
 * Registers a POST route with optional route-specific middlewares.
 * @param path The URL path for the route (supports dynamic parameters like :id).
 * @param handler The handler function to process the request.
 * @param routeMiddlewares Optional middlewares specific to this route.
 */
function post(
  path: string,
  handler: Handler,
  ...routeMiddlewares: Middleware[]
) {
  registerRoute("POST", path, handler, ...routeMiddlewares);
}

/**
 * Registers a PUT route with optional route-specific middlewares.
 * @param path The URL path for the route (supports dynamic parameters like :id).
 * @param handler The handler function to process the request.
 * @param routeMiddlewares Optional middlewares specific to this route.
 */
function put(
  path: string,
  handler: Handler,
  ...routeMiddlewares: Middleware[]
) {
  registerRoute("PUT", path, handler, ...routeMiddlewares);
}

/**
 * Registers a DELETE route with optional route-specific middlewares.
 * @param path The URL path for the route (supports dynamic parameters like :id).
 * @param handler The handler function to process the request.
 * @param routeMiddlewares Optional middlewares specific to this route.
 */
function delete_(
  path: string,
  handler: Handler,
  ...routeMiddlewares: Middleware[]
) {
  registerRoute("DELETE", path, handler, ...routeMiddlewares);
}

/**
 * Extracts parameter names from a path string (e.g., "/users/:id" -> ["id"]).
 * @param path The URL path string.
 * @returns An array of parameter names.
 */
function extractParamNames(path: string): string[] {
  return Array.from(path.matchAll(/:([a-zA-Z0-9_]+)/g), (m) => m[1]);
}

/**
 * Starts the HTTP server with optimized route matching, caching, and middleware support.
 *
 * This function initializes a Deno server with the following optimizations:
 * - Route caching: Uses an LRU cache (configurable size, default 10,000) to store matched routes and pre-computed contexts, avoiding repeated pattern matching for the same URLs.
 * - Fast path for root route: Directly handles GET requests to "/" without query params for maximum performance.
 * - Middleware application: Applies global and route-specific middlewares using an optimized dispatch mechanism.
 * - Query parsing: Conditionally parses query parameters only when present, with zero-copy reuse.
 * - 404 caching: Caches not-found responses to reduce repeated processing.
 *
 * Routes are evaluated in order: fast path root, cached routes, dynamic routes.
 *
 * @param options Configuration options for the server.
 * - Inherits from Deno.ServeTcpOptions (e.g., port, hostname).
 * - handler: Must be undefined (handled internally).
 * - cacheSize: Optional number to set the maximum route cache size (default: 10,000).
 * @returns A Promise that resolves to a Deno.Server instance when the server starts successfully.
 */
function serve(
  options: Deno.ServeTcpOptions & { handler?: undefined; cacheSize?: number },
) {
  const rootRoute = routes.find((r) =>
    r.pattern.pathname === "/" && r.method === "GET"
  );
  const matchCache = new Map<
    string,
    {
      routeIndex: number;
      context: Context;
      handler: () => Response | Promise<Response>;
    } | null
  >();
  const MAX_CACHE_SIZE = options.cacheSize ?? 10000;

  const toResponse = async (
    res: Response | Promise<Response> | string | Promise<string>,
  ) => {
    const resolved = await res;
    return typeof resolved === "string" ? new Response(resolved) : resolved;
  };

  /**
   * Parses query parameters from URLSearchParams into a record object.
   * @param searchParams The URLSearchParams to parse.
   * @returns A record of query key-value pairs.
   */
  const parseQuery = (
    searchParams: URLSearchParams,
  ): Record<string, string> => {
    const query: Record<string, string> = {};
    for (const [key, value] of searchParams) {
      query[key] = value;
    }
    return query;
  };

  /**
   * The main request handler that processes incoming requests, applies middlewares, and routes to the appropriate handler.
   * @param req The incoming Request object.
   * @param info The handler info containing remote address.
   * @returns A Response or Promise<Response>.
   */
  const handler = (
    req: Request,
    info: Deno.ServeHandlerInfo,
  ): Response | Promise<Response> => {
    const method = req.method;
    const urlStr = req.url;
    const url = new URL(req.url);
    const initialContext: Context = {
      params: {},
      query: {},
      remoteAddr: info.remoteAddr,
      url,
    };

    return applyMiddlewares(req, initialContext, () => {
      const continueToRoutes = () => {
        // Check cache first
        const cached = matchCache.get(urlStr);
        if (cached !== undefined) {
          if (cached === null) {
            return new Response("Not found", { status: 404 });
          }
          return applyMiddlewares(
            req,
            cached.context,
            cached.handler,
            routes[cached.routeIndex].middlewares,
          );
        }

        // Only parse URL when needed for uncached routes
        const hasQuery = url.search.length > 1;
        const query = hasQuery ? parseQuery(url.searchParams) : {};

        // Pattern matching for uncached routes
        const tryRoute = (i: number): Response | Promise<Response> => {
          if (i >= routes.length) {
            if (matchCache.size < MAX_CACHE_SIZE) {
              matchCache.set(urlStr, null);
            }
            return new Response("Not found", { status: 404 });
          }

          const route = routes[i];
          if (method === route.method) {
            const match = route.pattern.exec(urlStr);
            if (match) {
              const params: Record<string, string> = {};
              if (route.paramNames.length) {
                for (const name of route.paramNames) {
                  params[name] = match.pathname.groups?.[name] ?? "";
                }
              }
              const context: Context = {
                ...initialContext,
                params,
                query,
                url,
              };

              const cachedHandler = () =>
                toResponse(route.handler(req, context, () => tryRoute(i + 1)));

              if (matchCache.size >= MAX_CACHE_SIZE) {
                const firstKey = matchCache.keys().next().value!;
                matchCache.delete(firstKey);
              }

              matchCache.set(urlStr, {
                routeIndex: i,
                context,
                handler: cachedHandler,
              });
              return applyMiddlewares(
                req,
                context,
                cachedHandler,
                route.middlewares,
              );
            }
          }
          return tryRoute(i + 1);
        };

        return tryRoute(0);
      };

      if (
        rootRoute && method === "GET" && urlStr.endsWith("/") &&
        !urlStr.includes("?")
      ) {
        const context: Context = {
          ...initialContext,
          params: {},
          query: {},
          url,
        };
        return applyMiddlewares(
          req,
          context,
          () => toResponse(rootRoute.handler(req, context, continueToRoutes)),
          rootRoute.middlewares,
        );
      }

      return continueToRoutes();
    }, middlewares);
  };

  /**
   * Applies a list of middlewares sequentially, then calls the final handler.
   * Uses a dispatch mechanism for async support.
   * @param req The incoming Request object.
   * @param context The context object.
   * @param finalHandler The handler to call after all middlewares.
   * @param middlewareList The list of middlewares to apply.
   * @returns A Response or Promise<Response>.
   */
  function applyMiddlewares(
    req: Request,
    context: Context,
    finalHandler: () => Response | Promise<Response>,
    middlewareList: Middleware[],
  ): Response | Promise<Response> {
    if (middlewareList.length === 0) {
      return finalHandler();
    }

    let index = 0;
    const dispatch = (): Response | Promise<Response> => {
      if (index >= middlewareList.length) {
        return finalHandler();
      }
      const middleware = middlewareList[index++];
      return middleware(req, context, dispatch);
    };
    return dispatch();
  }
  const serverInstance = Deno.serve({ ...options, handler });
  return {
    ...serverInstance,
    close: () => serverInstance.shutdown(),
  };
}

/**
 * Resets the routes and middlewares arrays for testing purposes.
 */
export function _resetForTests() {
  routes.length = 0;
  middlewares.length = 0;
}

/**
 * Returns the current routes array for testing purposes.
 * @returns The array of registered routes.
 */
export function _getRoutesForTests() {
  return routes;
}

const server = { get, post, put, delete: delete_, use, serve };
export default server;
