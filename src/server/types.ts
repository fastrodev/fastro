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
  get(path: string, handler: Handler): Fastro;
  post(path: string, handler: Handler): Fastro;
  put(path: string, handler: Handler): Fastro;
  patch(path: string, handler: Handler): Fastro;
  delete(path: string, handler: Handler): Fastro;
  options(path: string, handler: Handler): Fastro;
  head(path: string, handler: Handler): Fastro;
  page<T = any>(path: string, page: Page<T>): Fastro;
  add(method: string, path: string, handler: Handler): Fastro;
}
