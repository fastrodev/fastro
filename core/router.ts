import { Context, Handler, Middleware } from "./types.ts";

export interface Route {
  method: string;
  path: string;
  handler: Handler;
  middlewares?: Middleware[];
}

async function toResponse(
  res:
    | Response
    | Promise<Response>
    | string
    | Promise<string>
    | Record<string, unknown>
    | Promise<Record<string, unknown>>,
): Promise<Response> {
  const resolved = await res;
  if (resolved instanceof Response) return resolved;
  if (typeof resolved === "string") return new Response(resolved);
  return Response.json(resolved);
}

/**
 * Converts a set of route definitions into a unified middleware.
 *
 * This is the engine behind `createRouter`. It handles the matching of
 * incoming requests against the routes you define, manages parameters,
 * and maintains a high-performance matching cache.
 *
 * @param routes An array of route objects to handle.
 * @returns A Fastro-compatible middleware function.
 */
export function build(routes: Route[]): Middleware {
  const cache = new Map<
    string,
    { params: Record<string, string>; routeIndex: number } | null
  >();
  const MAX_CACHE_SIZE = 1000;

  return (
    req: Request,
    ctx: Context,
    next: () => Response | Promise<Response>,
  ) => {
    const url = new URL(req.url);
    const method = req.method;
    const cacheKey = `${method}:${url.pathname}`;

    function tryRoute(index: number): Response | Promise<Response> {
      for (let i = index; i < routes.length; i++) {
        const route = routes[i];
        if (route.method !== method) continue;

        const match = matchPath(route.path, url.pathname);
        if (match) {
          // Only cache if it's the first match and no complex fallthrough is expected
          // or just cache the first match for simplicity
          if (index === 0 && cache.size < MAX_CACHE_SIZE) {
            cache.set(cacheKey, { params: match.params, routeIndex: i });
          }

          ctx.params = match.params;

          const mws = route.middlewares ?? [];
          const dispatch = (j: number): Response | Promise<Response> => {
            if (j < mws.length) {
              return mws[j](req, ctx, () => dispatch(j + 1));
            }
            return toResponse(route.handler(req, ctx, () => tryRoute(i + 1)));
          };

          return dispatch(0);
        }
      }

      if (index === 0 && cache.size < MAX_CACHE_SIZE) {
        cache.set(cacheKey, null);
      }
      return next();
    }

    // Check cache
    const cached = cache.get(cacheKey);
    if (cached !== undefined) {
      if (cached === null) return next();

      const route = routes[cached.routeIndex];
      ctx.params = { ...cached.params };
      const mws = route.middlewares ?? [];
      const dispatch = (j: number): Response | Promise<Response> => {
        if (j < mws.length) {
          return mws[j](req, ctx, () => dispatch(j + 1));
        }
        return toResponse(
          route.handler(req, ctx, () => tryRoute(cached.routeIndex + 1)),
        );
      };
      return dispatch(0);
    }

    return tryRoute(0);
  };
}

export function matchPath(
  routePath: string,
  requestPath: string,
): { params: Record<string, string> } | null {
  const routeParts = routePath.split("/");
  const requestParts = requestPath.split("/");

  if (routeParts.length !== requestParts.length) return null;

  const params: Record<string, string> = {};

  for (let i = 0; i < routeParts.length; i++) {
    const routePart = routeParts[i];
    const requestPart = requestParts[i];

    if (routePart.startsWith(":")) {
      if (!requestPart) return null; // Don't match empty segments for parameters
      params[routePart.slice(1)] = requestPart;
    } else if (routePart !== requestPart) {
      return null;
    }
  }

  return { params };
}

/**
 * A fluent builder for creating routes.
 */
export /**
 * Utility class for creating modular, chainable route groups.
 *
 * RouteBuilders allow you to define a set of routes in a standalone way
 * and then "plug" them into your main application as a single middleware.
 *
 * @example
 * ```ts
 * const router = createRouter()
 *   .get("/users", () => "All Users")
 *   .get("/users/:id", (req, ctx) => `User ${ctx.params.id}`);
 *
 * server.use(router.build());
 * ```
 */
class RouteBuilder {
  private routes: Route[] = [];

  /**
   * Registers a GET route in this router.
   *
   * @param path The URL path.
   * @param handler Function to process the request.
   * @param middlewares Optional middlewares for this specific route.
   */
  get(path: string, handler: Handler, ...middlewares: Middleware[]): this {
    this.routes.push({ method: "GET", path, handler, middlewares });
    return this;
  }

  /**
   * Registers a POST route in this router.
   *
   * @param path The URL path.
   * @param handler Function to process the request.
   * @param middlewares Optional middlewares for this specific route.
   */
  post(path: string, handler: Handler, ...middlewares: Middleware[]): this {
    this.routes.push({ method: "POST", path, handler, middlewares });
    return this;
  }

  /**
   * Registers a PUT route in this router.
   */
  put(path: string, handler: Handler, ...middlewares: Middleware[]): this {
    this.routes.push({ method: "PUT", path, handler, middlewares });
    return this;
  }

  /**
   * Registers a DELETE route in this router.
   */
  delete(path: string, handler: Handler, ...middlewares: Middleware[]): this {
    this.routes.push({ method: "DELETE", path, handler, middlewares });
    return this;
  }

  /**
   * Registers a PATCH route in this router.
   */
  patch(path: string, handler: Handler, ...middlewares: Middleware[]): this {
    this.routes.push({ method: "PATCH", path, handler, middlewares });
    return this;
  }

  /**
   * Registers a HEAD route in this router.
   */
  head(path: string, handler: Handler, ...middlewares: Middleware[]): this {
    this.routes.push({ method: "HEAD", path, handler, middlewares });
    return this;
  }

  /**
   * Registers an OPTIONS route in this router.
   */
  options(path: string, handler: Handler, ...middlewares: Middleware[]): this {
    this.routes.push({ method: "OPTIONS", path, handler, middlewares });
    return this;
  }

  /**
   * Compiles defined routes into a single Fastro middleware.
   * Call this when you're finished defining routes in the builder.
   */
  build(): Middleware {
    return build(this.routes);
  }
}

/**
 * Creates a new RouteBuilder instance for modular routing.
 *
 * This is the entry point for creating grouped routes that can be
 * exported or used as middleware.
 *
 * @example
 * ```ts
 * const api = createRouter().get("/ping", () => "pong");
 * server.use(api.build());
 * ```
 */
export function createRouter(): RouteBuilder {
  return new RouteBuilder();
}
