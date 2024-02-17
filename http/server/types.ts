// deno-lint-ignore-file no-explicit-any
import { ComponentChildren, JSX } from "./deps.ts";

/**
 * The callback which is called when the server starts listening.
 */
export type ListenHandler = (params: {
  hostname: string;
  port: number;
}) => void;

/**
 * Extends the native Http `Request` with `params`, `query`, and `parseBody`
 */
export class HttpRequest extends Request {
  [key: string]: any;
  params?: Record<string, string | undefined>;
  query?: Record<string, string>;
  parseBody!: <T>() => Promise<T>;
}

/**
 * Handle http request
 *
 * Example:
 * ```ts
 * const handler = (req: Request, ctx: Context) => {
 *   return ctx.send("Hello")
 * }
 *
 * ```
 */
export type Handler = (
  req: HttpRequest,
  ctx: Context,
) =>
  | string
  | Promise<string>
  | object
  | Promise<object>
  | bigint
  | Promise<bigint>
  | number
  | Promise<number>
  | boolean
  | Promise<boolean>
  | undefined
  | Promise<undefined>
  | Response
  | Promise<Response>
  | void
  | Promise<void>
  | Promise<Response | void>;

/**
 * The callback for middleware
 */
export type Next = {
  (): void;
};

/**
 * Middleware type used by server
 */
export type Middleware = {
  method?: string;
  path?: string;
  handler: Handler;
};

/**
 * Static type used by server
 */
export type Static = {
  file: string;
  contentType: string;
};

/**
 * Define the information for a HTTP request, render, send & options
 */
export class Context {
  /**
   * Render a JSX Component or a Page with data
   * - If you call it from a standart handler (GET, POST, PUT, DELETE), it will render a JSX component.
   * - If you call it from a page handler, it will render the data using the predefined JSX layout.
   * @param data
   * @returns
   */
  render!: <T>(data?: T | undefined) => Response | Promise<Response>;
  /**
   * Information for a HTTP request.
   */
  info!: Deno.ServeHandlerInfo;
  /**
   * Send data to client
   */
  send!: <T>(
    data?: T | undefined,
    status?: number | undefined,
  ) => Response | Promise<Response>;
  /**
   * Middleware callback
   */
  next!: Next;
  /**
   * Instance of server
   */
  server!: Fastro;
  /**
   * The URL interface represents an object providing static methods used for creating object URLs.
   */
  url!: URL;
  /**
   * Deno KV Instance defined in Fastro Constructor
   */
  kv!: Deno.Kv;
  /**
   * Server options defined in Fastro Constuctor
   */
  options!: Record<string, any>;
  [key: string]: any;
}

/**
 * Define the page component, layout, handler and its folder
 */
export type Page<T = any> = {
  component: FunctionComponent | JSX.Element;
  layout: Layout<T>;
  handler: Handler;
  script?: string;
  folder?: string;
};

/**
 * Defines the props of the page layout
 */
export type LayoutProps<T = any> = {
  children: ComponentChildren;
  data: T;
  nonce: string;
};

/**
 * Define the props of the page
 */
export type PageProps<T = any> = {
  data: T;
};

/**
 * Define the layout type
 */
export type Layout<T = any> = (
  props: LayoutProps<T>,
) => JSX.Element;

/**
 * Define the function component
 *
 * Example:
 * ```
 * const c = () => <div>Hello<div>
 * ```
 */
export type FunctionComponent = (props: any) => JSX.Element;

/**
 * Groups the handler, service, page, and layout
 *
 * Example:
 * ```ts
 * import fastro from "https://fastro.deno.dev/mod.ts";
 *
 * const f = new fastro();
 *
 * const helloModule = (f: Fastro) => {
 *   return f.get("/", () => "Hello World");
 * };
 *
 * await f.group(helloModule);
 *
 * await f.serve();
 * ```
 */
export type ModuleFunction = (f: Fastro) => Fastro | Promise<Fastro>;

/**
 * Defines the application endpoint, middleware, group, and serve
 *
 * Example:
 * ```ts
 * import fastro from "https://fastro.deno.dev/mod.ts";
 *
 * const f = new fastro();
 *
 * f.get("/", () => "Hello, World!");
 *
 * await f.serve();
 * ```
 */
export interface Fastro {
  serve: (options?: {
    port?: number;
    onListen?: ListenHandler;
  }) => Promise<void>;
  shutdown: () => void;
  get(
    path: string,
    ...handler: Array<Handler>
  ): Fastro;
  post(
    path: string,
    ...handler: Array<Handler>
  ): Fastro;
  put(
    path: string,
    ...handler: Array<Handler>
  ): Fastro;
  patch(
    path: string,
    ...handler: Array<Handler>
  ): Fastro;
  delete(
    path: string,
    ...handler: Array<Handler>
  ): Fastro;
  options(
    path: string,
    ...handler: Array<Handler>
  ): Fastro;
  head(
    path: string,
    ...handler: Array<Handler>
  ): Fastro;
  page<T = any>(
    path: string,
    page: Page<T>,
    ...middleware: Array<Handler>
  ): Fastro;
  add(method: string, path: string, handler: Handler): Fastro;
  use(...handler: Array<Handler>): Fastro;
  group(mf: ModuleFunction): Promise<Fastro>;
  serverOptions: Record<string, any>;
  getNonce(): string;
}
