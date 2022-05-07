// deno-lint-ignore-file no-explicit-any
import { ConnInfo, Handler, Cookie } from "./deps.ts"

export interface SSR {
  title: (title: string) => SSR
  hydrate: (path: string) => SSR
  element: (el: JSX.Element) => SSR
  render: () => Promise<Response>
}

export interface RequestResponse {
  deleteCookie: (name: string, attributes?: {
    path?: string | undefined
    domain?: string | undefined
  } | undefined) => RequestResponse
  setCookie: (cookie: Cookie) => RequestResponse
  headers: (headers: Headers) => RequestResponse
  authorization: (type: string) => RequestResponse
  contentType: (type: string) => RequestResponse
  status: (status: number) => RequestResponse
  send: (object: unknown) => Response | Promise<Response>
  json: (object: unknown) => Response | Promise<Response>
  ssr: () => Response | Promise<Response>
  html: (html: string) => Response | Promise<Response>
}

export type StringHandler = (request?: Request, connInfo?: ConnInfo) => string
export interface Router {
  routes: Map<string, Route>
  get(path: PathArgument, ...handlers: HandlerArgument[]): Router
  post(path: PathArgument, ...handlers: HandlerArgument[]): Router
  put(path: PathArgument, ...handlers: HandlerArgument[]): Router
  delete(path: PathArgument, ...handlers: HandlerArgument[]): Router
  patch(path: PathArgument, ...handlers: HandlerArgument[]): Router
  head(path: PathArgument, ...handlers: HandlerArgument[]): Router
  options(path: PathArgument, ...handlers: HandlerArgument[]): Router
}

export type PathArgument = string | RegExp

export interface Next {
  (error?: unknown): void
}
export type RequestHandler = (
  request: Request,
  connInfo: ConnInfo,
  next: Next,
) => void | Promise<void> | string | Promise<string> | Response | Promise<Response> | JSX.Element | any | Promise<any>

export type HandlerArgument = Handler | RequestHandler | RequestHandler[]
export type Route = {
  method: string
  path: PathArgument
  handlers: HandlerArgument[]
}

export interface Dependency {
  deps: Map<string, unknown>
  set(key: string, val: unknown): Dependency
  get(key: string): unknown
}
export type MiddlewareArgument =
  | Dependency
  | PathArgument
  | Router
  | RequestHandler
  | RequestHandler[]

export interface AppMiddleware {
  type: string
  path: PathArgument
  middlewares: MiddlewareArgument[]
}
