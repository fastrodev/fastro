import { ConnInfo, Handler, ServeInit } from "./deps.ts"

export interface Next {
  (err?: Error): void
}

export type Middleware = (request: Request, connInfo: ConnInfo, next: Next) => void

export interface Fastro {
  serve(options?: ServeInit): Promise<void>
  get(url: string, opts: Handler | Middleware, handler?: Handler): Fastro
  post(url: string, opts: Handler | Middleware, handler?: Handler): Fastro
  put(url: string, opts: Handler | Middleware, handler?: Handler): Fastro
  patch(url: string, opts: Handler | Middleware, handler?: Handler): Fastro
  delete(url: string, opts: Handler | Middleware, handler?: Handler): Fastro
  head(url: string, opts: Handler | Middleware, handler?: Handler): Fastro
  options(url: string, opts: Handler | Middleware, handler?: Handler): Fastro
}

export interface Route {
  method: string
  url: string
  middleware: Handler | Middleware
  handler: Handler
}

export interface Router {
  get(url: string, opts: Handler | Middleware, handler?: Handler): Router
  post(url: string, opts: Handler | Middleware, handler?: Handler): Router
  put(url: string, opts: Handler | Middleware, handler?: Handler): Router
  patch(url: string, opts: Handler | Middleware, handler?: Handler): Router
  delete(url: string, opts: Handler | Middleware, handler?: Handler): Router
  head(url: string, opts: Handler | Middleware, handler?: Handler): Router
  options(url: string, opts: Handler | Middleware, handler?: Handler): Router
  router: Map<string, Route>
}
