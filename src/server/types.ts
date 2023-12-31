// deno-lint-ignore-file no-explicit-any
import { ComponentChildren, JSX, VNode } from "preact";

export type ListenHandler = (info: {
  hostname: string;
  port: number;
}) => void;

export type Handler = (
  req: Request,
  ctx: Context,
) => Response | Promise<Response>;

export type Static = {
  file: string;
  contentType: string;
};

export type Context = {
  /**
   * Render a JSX Component or a Page with data
   * - If you call it from a standart handler (GET, POST, PUT, DELETE), it will render a JSX component.
   * - If you call it from a page handler, it will render the page with a pre-defined layout and data.
   * @param data
   * @returns
   */
  render: <T = any>(data?: T) => Response | Promise<Response>;
  /**
   * Information for a HTTP request.
   */
  info: Deno.ServeHandlerInfo;
  [key: string]: any;
};

export type Page<T = any> = {
  component: FunctionComponent | JSX.Element;
  layout: Layout<T>;
  handler: Handler;
  folder?: string;
};

export type LayoutProps<T = any> = {
  children: ComponentChildren;
  data?: T;
};

export type PageProps<T = any> = {
  data?: T;
};

export type Layout<T = any> = (
  props: LayoutProps<T>,
) => VNode;

export type FunctionComponent = (props: any) => JSX.Element;

export interface Fastro {
  serve: (port: number, onListen: ListenHandler) => void;
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
