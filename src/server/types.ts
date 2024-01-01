// deno-lint-ignore-file no-explicit-any
import { ComponentChildren, JSX } from "preact";

export type ListenHandler = (info: {
  hostname: string;
  port: number;
}) => void;

export type Handler<T = any> = (
  req: Request,
  ctx: Context<T>,
) => Response | Promise<Response>;

export interface Next {
  (error?: Error, data?: unknown): unknown;
}

export type Middleware<T = any> = {
  method?: string;
  path?: string;
  handler: Handler<T>;
};

export type Static = {
  file: string;
  contentType: string;
};

export type Context<T> = {
  /**
   * Render a JSX Component or a Page with data
   * - If you call it from a standart handler (GET, POST, PUT, DELETE), it will render a JSX component.
   * - If you call it from a page handler, it will render the data using the predefined JSX layout.
   * @param data
   * @returns
   */
  render: (data?: T) => Response | Promise<Response>;
  /**
   * Information for a HTTP request.
   */
  info: Deno.ServeHandlerInfo;
  params?: Record<string, string | undefined>;
  next: Next | any;
  [key: string]: any;
};

export type Page<T = any> = {
  component: FunctionComponent | JSX.Element;
  layout: Layout<T>;
  handler: Handler<T>;
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

export interface Fastro {
  serve: (port: number, onListen: ListenHandler) => Promise<void>;
  shutdown: () => void;
  get<T = any>(
    path: string,
    handler: Handler<T>,
    ...middleware: Array<Handler<T>>
  ): Fastro;
  post<T = any>(
    path: string,
    handler: Handler<T>,
    ...middleware: Array<Handler<T>>
  ): Fastro;
  put<T = any>(
    path: string,
    handler: Handler<T>,
    ...middleware: Array<Handler<T>>
  ): Fastro;
  patch<T = any>(
    path: string,
    handler: Handler<T>,
    ...middleware: Array<Handler<T>>
  ): Fastro;
  delete<T = any>(
    path: string,
    handler: Handler<T>,
    ...middleware: Array<Handler<T>>
  ): Fastro;
  options<T = any>(
    path: string,
    handler: Handler<T>,
    ...middleware: Array<Handler<T>>
  ): Fastro;
  head<T = any>(
    path: string,
    handler: Handler<T>,
    ...middleware: Array<Handler<T>>
  ): Fastro;
  page<T = any>(
    path: string,
    page: Page<T>,
    ...middleware: Array<Handler<T>>
  ): Fastro;
  add<T = any>(method: string, path: string, handler: Handler<T>): Fastro;
  use<T = any>(...handler: Array<Handler<T>>): Fastro;
}
