import { ConnInfo, ServeInit } from "$fastro/server/deps.ts";

export interface Next {
  (error?: unknown): void;
}

export type RequestResponse = {
  deleteCookie: (
    name: string,
    attributes?: {
      path?: string | undefined;
      domain?: string | undefined;
    } | undefined,
  ) => RequestResponse;
  // setCookie: (cookie: Cookie) => RequestResponse;
  headers: (headers: Headers) => RequestResponse;
  authorization: (type: string) => RequestResponse;
  contentType: (type: string) => RequestResponse;
  status: (status: number) => RequestResponse;
  send: (object: unknown) => Response | Promise<Response>;
  json: (object: unknown) => Response | Promise<Response>;
  // ssr: (ssr: SSR) => SSR;
  html: (html: string) => Response | Promise<Response>;
};

export type RequestHandler = (
  request: Request,
  response?: RequestResponse,
  next?: Next,
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
  /**
   * Accept incoming connections on the given listener, and handle requests on these connections with the given handler.
   *
   * HTTP/2 support is only enabled if the provided Deno.Listener returns TLS connections and was configured with "h2" in the ALPN protocols.
   *
   * Throws a server closed error if called after the server has been closed.
   *
   * @param options
   */
  serve(options?: ServeInit): Promise<void>;
  /**
   * Immediately close the server listeners and associated HTTP connections.
   *
   * Throws a server closed error if called after the server has been closed.
   */
  close(): void;
  /**
   * Add url endpoint for static files
   *
   * ```ts
   * import application from "$fastro/server/mod.ts";
   * const app = application();
   * app.static("/", "./public");
   * await app.serve();
   * ```
   *
   * @param path The base endpoint to access a file
   * @param folder The base folder to save all files
   */
  static(path: string, folder?: string): Fastro;
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
