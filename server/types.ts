import { ConnInfo, Handler, ServeInit } from "./deps.ts"

export interface Next {
  (error?: unknown): void
}

export type Middleware = (request: Request, connInfo: ConnInfo, next: Next) => void

export interface Fastro {
  serve(options?: ServeInit): Promise<void>
  get(path: string, opts: Handler | Middleware, handler?: Handler): Fastro
  post(path: string, opts: Handler | Middleware, handler?: Handler): Fastro
  put(path: string, opts: Handler | Middleware, handler?: Handler): Fastro
  patch(path: string, opts: Handler | Middleware, handler?: Handler): Fastro
  delete(path: string, opts: Handler | Middleware, handler?: Handler): Fastro
  head(path: string, opts: Handler | Middleware, handler?: Handler): Fastro
  options(path: string, opts: Handler | Middleware, handler?: Handler): Fastro
}

export interface Route {
  method: string
  path: string
  middleware: Handler | Middleware
  handler: Handler
}

export interface Router {
  get(path: string, opts: Handler | Middleware, handler?: Handler): Router
  post(path: string, opts: Handler | Middleware, handler?: Handler): Router
  put(path: string, opts: Handler | Middleware, handler?: Handler): Router
  patch(path: string, opts: Handler | Middleware, handler?: Handler): Router
  delete(path: string, opts: Handler | Middleware, handler?: Handler): Router
  head(path: string, opts: Handler | Middleware, handler?: Handler): Router
  options(path: string, opts: Handler | Middleware, handler?: Handler): Router
  router: Map<string, Route>
}
