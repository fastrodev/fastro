import { Middleware, Handler, Context } from "./server.ts";

export interface Route {
    method: string;
    path: string;
    handler: Handler;
    middlewares?: Middleware[];
}

/**
 * Creates a route middleware to handle defined routes.
 * @param routes An array of Route objects defining the routes to handle, including method, path, handler, and optional middlewares.
 * @returns A Middleware function that processes requests by matching routes, extracting parameters, and applying handlers and middlewares.
 */
export function build(routes: Route[]): Middleware {
    const cache = new Map<string, { params: Record<string, string>, routeIndex: number } | null>();
    const MAX_CACHE_SIZE = 1000;

    return (req: Request, ctx: Context, next: () => Response | Promise<Response>) => {
        const url = new URL(req.url);
        const method = req.method;
        const cacheKey = `${method}:${url.pathname}`;

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
                // Note: cached routes don't support fallthrough to NEXT route in the same builder
                // but they do support fallthrough to the global next()
                return route.handler(req, ctx, next);
            };
            return dispatch(0);
        }

        const tryRoute = (index: number): Response | Promise<Response> => {
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
                        return route.handler(req, ctx, () => tryRoute(i + 1));
                    };

                    return dispatch(0);
                }
            }

            if (index === 0 && cache.size < MAX_CACHE_SIZE) {
                cache.set(cacheKey, null);
            }
            return next();
        };

        return tryRoute(0);
    };
}

export function matchPath(routePath: string, requestPath: string): { params: Record<string, string> } | null {
    const routeParts = routePath.split('/');
    const requestParts = requestPath.split('/');

    if (routeParts.length !== requestParts.length) return null;

    const params: Record<string, string> = {};

    for (let i = 0; i < routeParts.length; i++) {
        const routePart = routeParts[i];
        const requestPart = requestParts[i];

        if (routePart.startsWith(':')) {
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
export class RouteBuilder {
    private routes: Route[] = [];

    /**
     * Registers a GET route.
     * @param path The route path.
     * @param handler The handler function.
     * @param middlewares Optional middlewares.
     * @returns The builder for chaining.
     */
    get(path: string, handler: Handler, ...middlewares: Middleware[]): this {
        this.routes.push({ method: 'GET', path, handler, middlewares });
        return this;
    }

    /**
     * Registers a POST route.
     * @param path The route path.
     * @param handler The handler function.
     * @param middlewares Optional middlewares.
     * @returns The builder for chaining.
     */
    post(path: string, handler: Handler, ...middlewares: Middleware[]): this {
        this.routes.push({ method: 'POST', path, handler, middlewares });
        return this;
    }

    /**
     * Registers a PUT route.
     * @param path The route path.
     * @param handler The handler function.
     * @param middlewares Optional middlewares.
     * @returns The builder for chaining.
     */
    put(path: string, handler: Handler, ...middlewares: Middleware[]): this {
        this.routes.push({ method: 'PUT', path, handler, middlewares });
        return this;
    }

    /**
     * Registers a DELETE route.
     * @param path The route path.
     * @param handler The handler function.
     * @param middlewares Optional middlewares.
     * @returns The builder for chaining.
     */
    delete(path: string, handler: Handler, ...middlewares: Middleware[]): this {
        this.routes.push({ method: 'DELETE', path, handler, middlewares });
        return this;
    }

    /**
     * Registers a PATCH route.
     * @param path The route path.
     * @param handler The handler function.
     * @param middlewares Optional middlewares.
     * @returns The builder for chaining.
     */
    patch(path: string, handler: Handler, ...middlewares: Middleware[]): this {
        this.routes.push({ method: 'PATCH', path, handler, middlewares });
        return this;
    }

    /**
     * Registers a HEAD route.
     * @param path The route path.
     * @param handler The handler function.
     * @param middlewares Optional middlewares.
     * @returns The builder for chaining.
     */
    head(path: string, handler: Handler, ...middlewares: Middleware[]): this {
        this.routes.push({ method: 'HEAD', path, handler, middlewares });
        return this;
    }

    /**
     * Registers an OPTIONS route.
     * @param path The route path.
     * @param handler The handler function.
     * @param middlewares Optional middlewares.
     * @returns The builder for chaining.
     */
    options(path: string, handler: Handler, ...middlewares: Middleware[]): this {
        this.routes.push({ method: 'OPTIONS', path, handler, middlewares });
        return this;
    }

    /**
     * Builds the middleware from the registered routes.
     * @returns A Middleware function.
     */
    build(): Middleware {
        return build(this.routes);
    }
}

/**
 * Creates a new RouteBuilder instance.
 * @returns A RouteBuilder for registering routes.
 */
export function createRouter(): RouteBuilder {
    return new RouteBuilder();
}