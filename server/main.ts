import { Fastro, HandlerOptions } from "./types.ts"
import { Handler, serve, ServeInit } from "./deps.ts"
import { Router } from "./router.ts"
import { createHandler } from "./handler.ts"

export function fastro(): Fastro {
  const router = Router()

  return {
    serve: (options: ServeInit = {}) => {
      const port = options.port ?? 8000
      const hostname = options.hostname ?? "localhost"
      console.log(`Listening on http://${hostname}:${port}`)
      serve(createHandler(router.router), options)
    },
    get: (url: string, opts: HandlerOptions, handler: Handler) => {
      router.get(url, opts, handler)
    },
    post: (url: string, opts: HandlerOptions, handler: Handler) => {
      router.post(url, opts, handler)
    },
    put: (url: string, opts: HandlerOptions, handler: Handler) => {
      router.put(url, opts, handler)
    },
    patch: (url: string, opts: HandlerOptions, handler: Handler) => {
      router.patch(url, opts, handler)
    },
    delete: (url: string, opts: HandlerOptions, handler: Handler) => {
      router.delete(url, opts, handler)
    },
    head: (url: string, opts: HandlerOptions, handler: Handler) => {
      router.head(url, opts, handler)
    },
    options: (url: string, opts: HandlerOptions, handler: Handler) => {
      router.options(url, opts, handler)
    },
  }
}
