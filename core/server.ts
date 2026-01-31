import { Context, Handler, Middleware, Route } from "./types.ts";

const routes: Route[] = [];
const middlewares: Middleware[] = [];
const routePaths: string[] = [];

function toResponse(res: unknown): Response | Promise<Response> {
  if (res instanceof Response) return res;
  if (typeof res === "string") return new Response(res);
  if (res instanceof Promise) return (res as Promise<unknown>).then(toResponse);
  return res as Response;
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
  u: URL | undefined,
  req: Request,
  urlStr: string,
  pathname: string,
  cacheKey: string,
  method: string,
  matchCache: Map<string, any>,
  MAX_CACHE_SIZE: number,
  routeRegex: RegExp[],
): Response | Promise<Response> {
  for (let j = i; j < routes.length; j++) {
    const route = routes[j];
    if (method === route.method) {
      const rawPattern = (route as any).pattern as any;
      let match: RegExpExecArray | null | undefined;
      let groups: Record<string, string> | undefined;
      if (
        rawPattern && rawPattern.pathname === undefined &&
        typeof rawPattern.exec === "function"
      ) {
        const res = rawPattern.exec(urlStr) as any;
        groups = res?.pathname?.groups;
        match = res ? ([] as unknown as RegExpExecArray) : null;
      } else {
        const regex = routeRegex[j];
        match = regex.exec(pathname);
        groups = (match as any)?.groups;
      }
      if (match) {
        const params: Record<string, string> = {};
        if (route.paramNames.length) {
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

        const next = () =>
          tryRoute(
            j + 1,
            context,
            u,
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
    const p = (path as any).pathname;
    routePaths.push(typeof p === "string" ? p : "");
  }
}

function get(
  path: string | URLPattern,
  handler: Handler,
  ...routeMiddlewares: Middleware[]
) {
  registerRoute("GET", path, handler, ...routeMiddlewares);
}

function post(
  path: string | URLPattern,
  handler: Handler,
  ...routeMiddlewares: Middleware[]
) {
  registerRoute("POST", path, handler, ...routeMiddlewares);
}

function put(
  path: string | URLPattern,
  handler: Handler,
  ...routeMiddlewares: Middleware[]
) {
  registerRoute("PUT", path, handler, ...routeMiddlewares);
}

function delete_(
  path: string | URLPattern,
  handler: Handler,
  ...routeMiddlewares: Middleware[]
) {
  registerRoute("DELETE", path, handler, ...routeMiddlewares);
}

function extractParamNames(path: string | URLPattern): string[] {
  const p = typeof path === "string"
    ? path
    : (path && (path as any).pathname) || "";
  if (typeof p !== "string") return [];
  return Array.from(p.matchAll(/:([a-zA-Z0-9_]+)/g), (m) => m[1]);
}

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
  const routeRegex: RegExp[] = routes.map((r, idx) => {
    let pStr = routePaths[idx];
    if (!pStr) pStr = "/";
    const escape = (s: string) => s.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
    const parts = pStr.split("/").map((p: string) => {
      if (!p) return "";
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

  const handler = (
    req: Request,
    info: Deno.ServeHandlerInfo,
  ): Response | Promise<Response> => {
    const urlStr = req.url;
    const method = req.method;

    if (method === "GET" && canUseFastRoot) {
      const thirdSlash = urlStr.indexOf("/", 8);
      if (urlStr.length === thirdSlash + 1) {
        const rootCtx = {
          params: emptyParams,
          query: emptyQuery,
          remoteAddr: info.remoteAddr,
          get url() {
            return new URL(urlStr);
          },
        } as unknown as Context;
        const res = rootRoute!.handler(req, rootCtx, rootNext);
        if (res instanceof Response) return res;
        if (typeof res === "string") return new Response(res);
        return toResponse(res);
      }
    }

    const cacheKey = method + ":" + urlStr;
    const cached = matchCache.get(cacheKey);
    const thirdSlash = urlStr.indexOf("/", 8);
    const qIdx = urlStr.indexOf("?", thirdSlash);
    const pathname = qIdx === -1
      ? urlStr.slice(thirdSlash)
      : urlStr.slice(thirdSlash, qIdx);

    if (cached !== undefined && !hasGlobalMiddlewares) {
      if (cached === null) return new Response("Not found", { status: 404 });
      const route = routes[cached.routeIndex];
      if (route.middlewares.length === 0) {
        const cachedCtx = {
          params: cached.params,
          query: cached.query,
          remoteAddr: info.remoteAddr,
          get url() {
            return new URL(urlStr);
          },
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
    } as any;

    const runFinal = () => {
      if (cached !== undefined) {
        if (cached === null) return new Response("Not found", { status: 404 });
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

export function _resetForTests() {
  routes.length = 0;
  middlewares.length = 0;
  routePaths.length = 0;
}

export function _getRoutesForTests() {
  return routes;
}

const server = { get, post, put, delete: delete_, use, serve };
export default server;
