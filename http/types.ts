export const SPLITTER = ":::",
  COLON = ":",
  DEFAULT_PORT = 9000,
  DEFAULT_HOST = "127.0.0.0",
  LOCALHOST = "localhost";
export const NOT_FOUND_TEXT = "Not found",
  NOT_FOUND_STATUS = 404,
  INTERNAL_SERVER_ERROR_STATUS = 500;
export const GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
  ALL = "*";
export interface Callback {
  (error?: unknown): void;
}
export type ServeOptions = {
  port?: number;
  hostname?: string;
  callback?: Callback;
};
export interface Application {
  serve(options?: ServeOptions): Promise<void>;
  get(path: PathArgument, handler: HandlerArgument): Application;
  post(path: PathArgument, handler: HandlerArgument): Application;
  put(path: PathArgument, handler: HandlerArgument): Application;
  delete(path: PathArgument, handler: HandlerArgument): Application;
  head(path: PathArgument, handler: HandlerArgument): Application;
  options(path: PathArgument, handler: HandlerArgument): Application;
  patch(path: PathArgument, handler: HandlerArgument): Application;
  use(path: PathArgument, handler: HandlerArgument): Application;
}

export interface HttpRequest extends Request {
  reqID: string;
  time: number;
}

export type StrHandler = (request?: Request) => string;
export type Handler = Deno.ServeHandler;
export type ReqHandler = (request: HttpRequest) =>
  | string
  | Promise<string>
  | Response
  | Promise<Response>;
export type HandlerArgument = Handler | ReqHandler;
export type PathArgument = string | RegExp;
export type Route = {
  method: string;
  path: PathArgument;
  handler: HandlerArgument;
};
export interface Router {
  routes: Map<string, Route>;
  get(path: PathArgument, handler: HandlerArgument): Router;
  post(path: PathArgument, handler: HandlerArgument): Router;
  put(path: PathArgument, handler: HandlerArgument): Router;
  delete(path: PathArgument, handler: HandlerArgument): Router;
  patch(path: PathArgument, handler: HandlerArgument): Router;
  head(path: PathArgument, handler: HandlerArgument): Router;
  options(path: PathArgument, handler: HandlerArgument): Router;
  use(path: PathArgument, handler: HandlerArgument): Router;
}
