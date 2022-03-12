import { Handler, ServeInit } from "./deps.ts"

export type HandlerOptions = Record<never, never>

export interface Fastro {
  serve(options?: ServeInit): void
  get(url: string, opts: HandlerOptions, handler: Handler): void
  post(url: string, opts: HandlerOptions, handler: Handler): void
  put(url: string, opts: HandlerOptions, handler: Handler): void
  patch(url: string, opts: HandlerOptions, handler: Handler): void
  delete(url: string, opts: HandlerOptions, handler: Handler): void
  head(url: string, opts: HandlerOptions, handler: Handler): void
  options(url: string, opts: HandlerOptions, handler: Handler): void
}

export interface Route {
  method: string
  url: string
  options: HandlerOptions
  handler: Handler
}

export interface Router {
  get(url: string, opts: HandlerOptions, handler: Handler): Router
  post(url: string, opts: HandlerOptions, handler: Handler): Router
  put(url: string, opts: HandlerOptions, handler: Handler): Router
  patch(url: string, opts: HandlerOptions, handler: Handler): Router
  delete(url: string, opts: HandlerOptions, handler: Handler): Router
  head(url: string, opts: HandlerOptions, handler: Handler): Router
  options(url: string, opts: HandlerOptions, handler: Handler): Router
  router: Map<string, Route>
}
