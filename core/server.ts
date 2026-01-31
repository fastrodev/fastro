import { Context, Handler, Middleware, Route } from "./types.ts";

const routes: Route[] = [];
const middlewares: Middleware[] = [];

function use(middleware: Middleware) {
  middlewares.push(middleware);
}

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

function get(
  path: string,
  handler: Handler,
  ...routeMiddlewares: Middleware[]
) {
  registerRoute("GET", path, handler, ...routeMiddlewares);
}

function post(
  path: string,
  handler: Handler,
  ...routeMiddlewares: Middleware[]
) {
  registerRoute("POST", path, handler, ...routeMiddlewares);
}

function put(
  path: string,
  handler: Handler,
  ...routeMiddlewares: Middleware[]
) {
  registerRoute("PUT", path, handler, ...routeMiddlewares);
}

function delete_(
  path: string,
  handler: Handler,
  ...routeMiddlewares: Middleware[]
) {
  registerRoute("DELETE", path, handler, ...routeMiddlewares);
}

function extractParamNames(path: string): string[] {
  return Array.from(path.matchAll(/:([a-zA-Z0-9_]+)/g), (m) => m[1]);
}

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
      params: Record<string, string>;
      query: Record<string, string>;
    } | null
  >();
  const MAX_CACHE_SIZE = options.cacheSize ?? 10000;

  const toResponse = (res: unknown): Response | Promise<Response> => {
    if (res instanceof Promise) return res.then(toResponse);
    if (typeof res === "string") return new Response(res);
    if (res instanceof Response) return res;
    return res as Response;
  };

  const parseQuery = (
    searchParams: URLSearchParams,
  ): Record<string, string> => {
    const query: Record<string, string> = {};
    for (const [key, value] of searchParams) {
      query[key] = value;
    }
    return query;
  };

  const rootNext = () => {
    throw new Error("next() called in root route");
  };

  const handler = (
    req: Request,
    info: Deno.ServeHandlerInfo,
  ): Response | Promise<Response> => {
    const method = req.method;
    const urlStr = req.url;

    // Fast detection of root path
    const thirdSlash = urlStr.indexOf("/", 8);
    const hasQuery = urlStr.includes("?", thirdSlash);
    const isRoot = !hasQuery && urlStr.length === thirdSlash + 1;

    // 1. Optimized GET / match
    if (
      isRoot && method === "GET" &&
      rootRoute && middlewares.length === 0 &&
      rootRoute.middlewares.length === 0
    ) {
      const ctx: Context = {
        params: {},
        query: {},
        remoteAddr: info.remoteAddr,
        get url() {
          return new URL(urlStr);
        },
      };
      const res = rootRoute.handler(req, ctx, rootNext);
      if (typeof res === "string") return new Response(res);
      if (res instanceof Response) return res;
      return toResponse(res);
    }

    const cacheKey = method + ":" + urlStr;
    const cached = matchCache.get(cacheKey);

    // 2. Early cache return (no global middlewares)
    if (cached !== undefined && middlewares.length === 0) {
      if (cached === null) return new Response("Not found", { status: 404 });
      const route = routes[cached.routeIndex];
      if (route.middlewares.length === 0) {
        const ctx: Context = {
          params: cached.params,
          query: cached.query,
          remoteAddr: info.remoteAddr,
          get url() {
            return new URL(urlStr);
          },
        };
        const res = route.handler(req, ctx, () => {
          return tryRoute(cached.routeIndex + 1, ctx, undefined);
        });
        if (typeof res === "string") return new Response(res);
        if (res instanceof Response) return res;
        return toResponse(res);
      }
    }

    // 3. Regular path
    const url = hasQuery ? new URL(urlStr) : undefined;
    const ctx: Context = {
      params: {},
      query: (url && url.search.length > 1) ? parseQuery(url.searchParams) : {},
      remoteAddr: info.remoteAddr,
      get url() {
        return url || new URL(urlStr);
      },
    };

    const runFinal = () => {
      if (cached !== undefined) {
        if (cached === null) return new Response("Not found", { status: 404 });
        const route = routes[cached.routeIndex];
        ctx.params = cached.params;
        const handler = () =>
          toResponse(route.handler(
            req,
            ctx,
            () => tryRoute(cached.routeIndex + 1, ctx, url),
          ));

        if (route.middlewares.length === 0) return handler();
        return applyMiddlewares(req, ctx, handler, route.middlewares);
      }
      return tryRoute(0, ctx, url);
    };

    if (middlewares.length === 0) return runFinal();
    return applyMiddlewares(req, ctx, runFinal, middlewares);
    function tryRoute(
      i: number,
      context: Context,
      u: URL | undefined,
    ): Response | Promise<Response> {
      for (let j = i; j < routes.length; j++) {
        const route = routes[j];
        if (method === route.method) {
          const match = route.pattern.exec(urlStr);
          if (match) {
            const params: Record<string, string> = {};
            if (route.paramNames.length) {
              const groups = match.pathname.groups;
              for (const name of route.paramNames) {
                params[name] = groups?.[name] ?? "";
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

            if (route.middlewares.length === 0) {
              return toResponse(route.handler(
                req,
                context,
                () => tryRoute(j + 1, context, u),
              ));
            }

            return applyMiddlewares(
              req,
              context,
              () =>
                toResponse(route.handler(
                  req,
                  context,
                  () => tryRoute(j + 1, context, u),
                )),
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
  };

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

  const serverInstance = Deno.serve({ ...options, handler });
  return {
    ...serverInstance,
    close: () => serverInstance.shutdown(),
  };
}

export function _resetForTests() {
  routes.length = 0;
  middlewares.length = 0;
}

export function _getRoutesForTests() {
  return routes;
}

const server = { get, post, put, delete: delete_, use, serve };
export default server;
