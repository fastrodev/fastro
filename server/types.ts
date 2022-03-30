import { ConnInfo, Handler } from "./deps.ts";

export interface Router {
  routes: Map<string, Route>;
  get(path: PathArgument, ...handlers: HandlerArgument[]): Router;
  post(path: PathArgument, ...handlers: HandlerArgument[]): Router;
  put(path: PathArgument, ...handlers: HandlerArgument[]): Router;
  delete(path: PathArgument, ...handlers: HandlerArgument[]): Router;
  patch(path: PathArgument, ...handlers: HandlerArgument[]): Router;
  head(path: PathArgument, ...handlers: HandlerArgument[]): Router;
  options(path: PathArgument, ...handlers: HandlerArgument[]): Router;
}

export type PathArgument = string | RegExp;

export interface Next {
  (error?: unknown): void;
}
export type RequestHandler = (
  request: Request,
  connInfo: ConnInfo,
  next: Next,
) => void | Promise<void> | Response | Promise<Response>;

export type HandlerArgument = Handler | RequestHandler | RequestHandler[];

export type Route = {
  method: string;
  path: PathArgument;
  handlers: HandlerArgument[];
};

export type MiddlewareArgument =
  | PathArgument
  | Router
  | RequestHandler
  | RequestHandler[];

export interface AppMiddleware {
  type: string;
  path: PathArgument;
  middlewares: MiddlewareArgument[];
}
