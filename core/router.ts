import type { Context, Handler, Middleware, Server } from "./types.ts";

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
  private serverApp?: Server;

  constructor(serverApp?: Server) {
    this.serverApp = serverApp;
  }

  /**
   * Registers a GET route in this router.
   *
   * @param path The URL path.
   * @param handler Function to process the request.
   * @param middlewares Optional middlewares for this specific route.
   */
  get(path: string, handler: Handler, ...middlewares: Middleware[]): this {
    if (this.serverApp) {
      this.serverApp.get(path, handler, ...middlewares);
    }
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
    if (this.serverApp) {
      this.serverApp.post(path, handler, ...middlewares);
    }
    return this;
  }

  /**
   * Registers a PUT route in this router.
   *
   * @param path The URL path.
   * @param handler Function to process the request.
   * @param middlewares Optional middlewares for this specific route.
   */
  put(path: string, handler: Handler, ...middlewares: Middleware[]): this {
    if (this.serverApp) {
      this.serverApp.put(path, handler, ...middlewares);
    }
    return this;
  }

  /**
   * Registers a DELETE route in this router.
   *
   * @param path The URL path.
   * @param handler Function to process the request.
   * @param middlewares Optional middlewares for this specific route.
   */
  delete(path: string, handler: Handler, ...middlewares: Middleware[]): this {
    if (this.serverApp) {
      this.serverApp.delete(path, handler, ...middlewares);
    }
    return this;
  }

  /**
   * Registers a PATCH route in this router.
   *
   * @param path The URL path.
   * @param handler Function to process the request.
   * @param middlewares Optional middlewares for this specific route.
   */
  patch(path: string, handler: Handler, ...middlewares: Middleware[]): this {
    if (this.serverApp) {
      this.serverApp.patch(path, handler, ...middlewares);
    }
    return this;
  }

  /**
   * Registers a HEAD route in this router.
   *
   * @param path The URL path.
   * @param handler Function to process the request.
   * @param middlewares Optional middlewares for this specific route.
   */
  head(path: string, handler: Handler, ...middlewares: Middleware[]): this {
    if (this.serverApp) {
      this.serverApp.head(path, handler, ...middlewares);
    }
    return this;
  }

  /**
   * Registers an OPTIONS route in this router.
   *
   * @param path The URL path.
   * @param handler Function to process the request.
   * @param middlewares Optional middlewares for this specific route.
   */
  options(path: string, handler: Handler, ...middlewares: Middleware[]): this {
    if (this.serverApp) {
      this.serverApp.options(path, handler, ...middlewares);
    }
    return this;
  }

  /**
   * Compiles defined routes into a single Fastro middleware.
   * Call this when you're finished defining routes in the builder.
   *
   * @returns A Fastro-compatible middleware function.
   */
  build(): Middleware {
    // When using server-attached routing the builder registers routes
    // directly on the server. Return a noop middleware so callers can
    // still call `.build()` and mount the result without side effects.
    return (
      _req: Request,
      _ctx: Context,
      next: () => Response | Promise<Response>,
    ) => next();
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
export function createRouter(serverApp: Server): RouteBuilder {
  if (!serverApp) {
    throw new Error("createRouter(serverApp) requires a server instance");
  }
  return new RouteBuilder(serverApp);
}

// Allow tests to adjust cache size for coverage/eviction testing.
// Router now delegates route registration to the server. No local cache
// or build-time middleware remains in this module.
