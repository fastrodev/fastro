import { Handler } from "./deps.ts"
import { Middleware, Route, Router } from "./types.ts"

export function Route(hostname: string, port: number): Router {
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
    middleware: Handler | Middleware,
    handler: Handler,
  ) {
    const route = { method, url, middleware, handler }
    const key = method + ':' + 'http://' + hostname + ':' + port + url
    routerMap.set(key, route)
    return instance
  }

  function get(url: string, middleware: Middleware, handler: Handler): Router {
    return createRoute("GET", url, middleware, handler)
  }

  function post(url: string, middleware: Middleware, handler: Handler): Router {
    return createRoute("POST", url, middleware, handler)
  }

  function put(url: string, middleware: Middleware, handler: Handler): Router {
    return createRoute("PUT", url, middleware, handler)
  }

  function patch(url: string, middleware: Middleware, handler: Handler): Router {
    return createRoute("PATCH", url, middleware, handler)
  }

  function remove(url: string, middleware: Middleware, handler: Handler): Router {
    return createRoute("DELETE", url, middleware, handler)
  }

  function head(url: string, middleware: Middleware, handler: Handler): Router {
    return createRoute("HEAD", url, middleware, handler)
  }

  function options(
    url: string,
    middleware: Middleware,
    handler: Handler,
  ): Router {
    return createRoute(url, "OPTIONS", middleware, handler)
  }

  return instance
}
