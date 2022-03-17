import { Fastro, Middleware } from './types.ts'
import { Handler, serve, ServeInit } from './deps.ts'
import { Route } from './router.ts'
import { createHandler } from './handler.ts'

export function fastro(): Fastro {
  const r = Route()
  const f = {
    serve: (options: ServeInit = {}) => {
      return serve(createHandler(r.router), options)
    },
    get: (url: string | RegExp, opts: Handler | Middleware, handler: Handler) => {
      r.get(url, opts, handler)
      return f
    },
    post: (url: string | RegExp, opts: Handler | Middleware, handler: Handler) => {
      r.post(url, opts, handler)
      return f
    },
    put: (url: string | RegExp, opts: Handler | Middleware, handler: Handler) => {
      r.put(url, opts, handler)
      return f
    },
    patch: (url: string | RegExp, opts: Handler | Middleware, handler: Handler) => {
      r.patch(url, opts, handler)
      return f
    },
    delete: (url: string | RegExp, opts: Handler | Middleware, handler: Handler) => {
      r.delete(url, opts, handler)
      return f
    },
    head: (url: string | RegExp, opts: Handler | Middleware, handler: Handler) => {
      r.head(url, opts, handler)
      return f
    },
    options: (url: string | RegExp, opts: Handler | Middleware, handler: Handler) => {
      r.options(url, opts, handler)
      return f
    },
  }
  return f
}
