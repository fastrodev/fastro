// deno-lint-ignore-file no-explicit-any
import { Cookie, ServeInit } from "./deps.ts";

export interface Next {
  (error?: unknown): void;
}

export type HttpResponse = {
  deleteCookie: (
    name: string,
    attributes?: {
      path?: string | undefined;
      domain?: string | undefined;
    } | undefined,
  ) => HttpResponse;
  setCookie: (cookie: Cookie) => HttpResponse;
  headers: (headers: Headers) => HttpResponse;
  authorization: (type: string) => HttpResponse;
  contentType: (type: string) => HttpResponse;
  status: (status: number) => HttpResponse;
  send: (object: unknown) => Response | Promise<Response>;
  json: (object: unknown) => Response | Promise<Response>;
  ssr: (ssr: SSR) => SSR;
  html: (html: string) => Response | Promise<Response>;
  jsx: (element: JSX.Element) => Response | Promise<Response>;
};

export class HttpRequest extends Request {
  match!: URLPatternResult | null;
}

export type RequestHandler = (
  request: HttpRequest,
  response: HttpResponse,
  next?: Next,
) =>
  | void
  | Promise<void>
  | string
  | Promise<string>
  | Response
  | Promise<Response>
  | any
  | Promise<any>;

export type MiddlewareArgument = (
  request: HttpRequest,
  response: HttpResponse,
  next: Next,
) =>
  | void
  | Promise<void>
  | string
  | Promise<string>
  | Response
  | Promise<Response>
  | any
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
   * import application from "./mod.ts";
   * const app = application();
   * app.static("/", "./public");
   * await app.serve();
   * ```
   *
   * @param path The base endpoint to access a file
   * @param folder The base folder to save all files
   */
  static(path: string, folder?: string): Fastro;
  use(...middleware: Array<MiddlewareArgument>): Fastro;
  get(path: string, handler: HandlerArgument): Fastro;
  post(path: string, handler: HandlerArgument): Fastro;
  put(path: string, handler: HandlerArgument): Fastro;
  delete(path: string, handler: HandlerArgument): Fastro;
  patch(path: string, handler: HandlerArgument): Fastro;
  options(path: string, handler: HandlerArgument): Fastro;
  page(
    path: string,
    ssr: SSR,
    handler: HandlerArgument,
  ): Fastro;
};

export type SSRHandler = {
  path: string;
  ssr: SSR;
  handler: HandlerArgument;
};

export type StartOptions = {
  flash: boolean;
};

export type ExecHandler = (
  request?: HttpRequest,
  response?: HttpResponse,
  next?: Next,
) => any;

export type RenderOptions = {
  title: string;
  style?: string;
  link?: string;
  script?: string;
  meta?: string;
  bundle?: string;
};

export interface SSR {
  dir: (dir: string) => SSR;
  title: (title: string) => SSR;
  meta: (meta: string) => SSR;
  script: (script: string) => SSR;
  style: (style: string) => SSR;
  link: (link: string) => SSR;
  cdn: (cdn: string) => SSR;
  render: () => Response;
  /** Used by internal system to hydrate and create bundle on application initiation */
  _createBundle: (
    bundle?: string,
    rootComponent?: string,
    rootTSX?: string,
  ) => void;
  /** Used by internal system to set request on response init to get the url. This url is used to get the hydrated and bundled JS file. */
  _setRequest: (req: Request) => void;
  _getBundleName: () => string;
  setBundleName: (name: string) => SSR;
}
