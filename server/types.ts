// deno-lint-ignore-file no-explicit-any
import { Cookie, ServeInit } from "./deps.ts";

export type SetOptions = {
  isExpired?: boolean;
  expirySeconds?: number;
};

export interface Container {
  objects: () => Map<string, Data>;
  set: <T>(
    key: string,
    value: T,
    options?: SetOptions,
  ) => void;
  get: <T>(key: string) => T | null;
  size: () => number;
  clear: () => void;
  delete: (key: string) => boolean;
  clearInterval: () => void;
}

export type Data = {
  key: string;
  value: any;
  isExpired: boolean;
  expiryTime: number;
  timeoutId?: number;
};

export interface Next {
  (error?: Error): void;
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
  container!: () => Container;
  get!: <T>(key: string) => T | null;
  set!: <T>(key: string, value: T, options?: SetOptions) => void;
  delete!: (key: string) => void;
  param!: (name: string) => string;
  query!: (name: string) => string | null;
}

export type RouteMidleware = {
  method: string;
  path: string;
  handler: MiddlewareArgument;
};

export type AppMidleware = {
  path: string;
  handler: MiddlewareArgument;
};

export type RequestHandler = (
  request: HttpRequest,
  response: HttpResponse,
) =>
  | Response
  | Promise<Response>;

export type AppMiddlewareArgument = string | MiddlewareArgument;

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

export type HandlerArgument =
  | Deno.ServeHandler
  | RequestHandler
  | MiddlewareArgument;

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
   * Add url endpoint for static files.
   *
   * Place your files in the public folder
   *
   * ```ts
   * import application from "./mod.ts";
   * const app = application();
   * app.static("/public");
   * await app.serve();
   * ```
   *
   * Place your files in the static folder
   *
   * ```ts
   * app.static("/static");
   * ```
   *
   * Place your files in the app root folder
   *
   * ```ts
   * app.static("/");
   * ```
   *
   * @param path The base endpoint to access a file
   * @param maxAge Cache control of the file
   */
  static(path: string, maxAge?: number): Fastro;
  use(...middleware: Array<MiddlewareArgument>): Fastro;
  get(path: string, ...handler: Array<HandlerArgument>): Fastro;
  post(path: string, ...handler: Array<HandlerArgument>): Fastro;
  put(path: string, ...handler: Array<HandlerArgument>): Fastro;
  delete(path: string, ...handler: Array<HandlerArgument>): Fastro;
  patch(path: string, ...handler: Array<HandlerArgument>): Fastro;
  options(path: string, ...handler: Array<HandlerArgument>): Fastro;
  head(path: string, ...handler: Array<HandlerArgument>): Fastro;
  flash(isFlash: boolean): Fastro;
  build(isBuild: boolean): Fastro;
  /**
   * Set data to container
   *
   * ```ts
   * app.set("key1", "value1")
   * ```
   *
   * you can access them from handler
   *
   * ```ts
   * req.get("key1")
   * ```
   *
   * @param key
   * @param value
   * @param options
   */
  set<T>(key: string, value: T, options?: SetOptions): Fastro;
  page(
    path: string,
    ssr: SSR,
    handler: HandlerArgument,
  ): Fastro;
  container: Container;
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
) => any | Promise<any>;

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
  htmlAttr: (attr: string) => SSR;
  bodyAttr: (attr: string) => SSR;
  rootAttr: (attr: string) => SSR;
  lang: (lang: string) => SSR;
  cdn: (cdn: string) => SSR;
  ogTitle: (title: string) => SSR;
  ogType: (type: string) => SSR;
  ogImage: (image: string) => SSR;
  ogURL: (url: string) => SSR;
  ogSiteName: (name: string) => SSR;
  ogDesc: (desc: string) => SSR;
  twitterCard: (card: string) => SSR;
  metaDesc: (desc: string) => SSR;
  props: (props: any) => SSR;
  request: (req: HttpRequest) => SSR;
  cache: (cache: Container) => SSR;
  render: () => Response;
  _createBundle: (
    bundle?: string,
    rootComponent?: string,
    rootTSX?: string,
  ) => void;
  _getBundleName: () => string;
  bundle: (name: string) => SSR;
}

export type JSXHandler = (props?: any) => JSX.Element;

export type Row = Record<string, any>;
