import { ConnInfo, Handler } from "./deps.ts";

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
  | RequestHandler
  | RequestHandler[];

export interface AppMiddleware {
  path: PathArgument;
  middlewares: MiddlewareArgument[];
}
