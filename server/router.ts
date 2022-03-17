import { Handler } from "./deps.ts"
import { Middleware, Route, Router } from "./types.ts"

export function Route(): Router {
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
    path: string | RegExp,
    middleware: Handler | Middleware,
    handler: Handler,
  ) {
    const route = { method, path, middleware, handler }
    routerMap.set(`${method}#localhost#${path}`, route)
    return instance
  }

  function get(path: string | RegExp, middleware: Middleware, handler: Handler): Router {
    return createRoute("GET", path, middleware, handler)
  }

  function post(path: string | RegExp, middleware: Middleware, handler: Handler): Router {
    return createRoute("POST", path, middleware, handler)
  }

  function put(path: string | RegExp, middleware: Middleware, handler: Handler): Router {
    return createRoute("PUT", path, middleware, handler)
  }

  function patch(path: string | RegExp, middleware: Middleware, handler: Handler): Router {
    return createRoute("PATCH", path, middleware, handler)
  }

  function remove(path: string | RegExp, middleware: Middleware, handler: Handler): Router {
    return createRoute("DELETE", path, middleware, handler)
  }

  function head(path: string | RegExp, middleware: Middleware, handler: Handler): Router {
    return createRoute("HEAD", path, middleware, handler)
  }

  function options(
    path: string | RegExp,
    middleware: Middleware,
    handler: Handler,
  ): Router {
    return createRoute("OPTIONS", path, middleware, handler)
  }

  return instance
}
