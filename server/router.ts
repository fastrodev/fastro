import { Handler } from "./deps.ts"
import { HandlerOptions, Route, Router } from "./types.ts"

export function Router(): Router {
  const routerMap: Map<string, Route> = new Map()

  const instance: Router = {
    get,
    post,
    put,
    patch,
    head,
    options,
    delete: remove,
    router: routerMap,
  }

  function createRoute(
    method: string,
    url: string,
    opts: HandlerOptions,
    handler: Handler,
  ) {
    const key = method + ":" + url
    const route = { method, url, options: opts, handler }
    routerMap.set(key, route)
    return instance
  }

  function get(url: string, opts: HandlerOptions, handler: Handler): Router {
    return createRoute("GET", url, opts, handler)
  }

  function post(url: string, opts: HandlerOptions, handler: Handler): Router {
    return createRoute("POST", url, opts, handler)
  }

  function put(url: string, opts: HandlerOptions, handler: Handler): Router {
    return createRoute("PUT", url, opts, handler)
  }

  function patch(url: string, opts: HandlerOptions, handler: Handler): Router {
    return createRoute("PATCH", url, opts, handler)
  }

  function remove(url: string, opts: HandlerOptions, handler: Handler): Router {
    return createRoute("DELETE", url, opts, handler)
  }

  function head(url: string, opts: HandlerOptions, handler: Handler): Router {
    return createRoute("HEAD", url, opts, handler)
  }

  function options(
    url: string,
    opts: HandlerOptions,
    handler: Handler,
  ): Router {
    return createRoute(url, "OPTIONS", opts, handler)
  }

  return instance
}
