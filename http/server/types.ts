// deno-lint-ignore-file no-explicit-any
import { ComponentChildren, JSX } from "./deps.ts";

export type ListenHandler = (info: {
  hostname: string;
  port: number;
}) => void;

export class HttpRequest extends Request {
  [key: string]: any;
  params?: Record<string, string | undefined>;
  query?: Record<string, string>;
  parseBody!: <T>() => Promise<T>;
}

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

export interface Next {
  (): void;
}

export type Middleware = {
  method?: string;
  path?: string;
  handler: Handler;
};

export type Static = {
  file: string;
  contentType: string;
};

export interface Context {
  /**
   * Render a JSX Component or a Page with data
   * - If you call it from a standart handler (GET, POST, PUT, DELETE), it will render a JSX component.
   * - If you call it from a page handler, it will render the data using the predefined JSX layout.
   * @param data
   * @returns
   */
  render: <T>(data?: T) => Response | Promise<Response>;
  /**
   * Information for a HTTP request.
   */
  info: Deno.ServeHandlerInfo;
  send: <T>(data?: T, status?: number) => Response | Promise<Response>;
  next: Next;
  server: Fastro;
  url: URL;
  kv: Deno.Kv;
  options: Record<string, any>;
  [key: string]: any;
}

export type Page<T = any> = {
  component: FunctionComponent | JSX.Element;
  layout: Layout<T>;
  handler: Handler;
  folder?: string;
};

export type LayoutProps<T = any> = {
  children: ComponentChildren;
  data: T;
};

export type PageProps<T = any> = {
  data: T;
};

export type Layout<T = any> = (
  props: LayoutProps<T>,
) => JSX.Element;

export type FunctionComponent = (props: any) => JSX.Element;

export type ModuleFunction = (f: Fastro) => Fastro | Promise<Fastro>;

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
}
