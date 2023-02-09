import { ConnInfo, ServeInit } from "$fastro/server/deps.ts";

export interface Next {
  (error?: unknown): void;
}

export type RequestHandler = (
  request: Request,
  next: Next,
) =>
  | void
  | Promise<void>
  | string
  | Promise<string>
  | Response
  | Promise<Response>
  // deno-lint-ignore no-explicit-any
  | any
  // deno-lint-ignore no-explicit-any
  | Promise<any>;

export type HandlerArgument = Deno.ServeHandler | RequestHandler;

export type Route = {
  method: string;
  path: string;
  handler: HandlerArgument;
};

export type Fastro = {
  serve(options?: ServeInit): Promise<void>;
  close(): void;
  get(path: string, handler: HandlerArgument): Fastro;
  post(path: string, handler: HandlerArgument): Fastro;
  put(path: string, handler: HandlerArgument): Fastro;
  delete(path: string, handler: HandlerArgument): Fastro;
  patch(path: string, handler: HandlerArgument): Fastro;
  options(path: string, handler: HandlerArgument): Fastro;
};

export type StartOptions = {
  flash: boolean;
};

export type StringHandler = (request?: Request, connInfo?: ConnInfo) => string;
