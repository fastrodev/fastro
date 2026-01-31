import React from "react";

export type RenderToStringOptions = {
  identifierPrefix?: string;
  signal?: AbortSignal;
  nonceProvider?: () => string;
  onError?: (error: unknown) => void;
};

export type RenderOptions = {
  module?: string;
  includeDoctype?: boolean;
  includeHead?: boolean;
  head?: string;
  title?: string;
  initialProps?: Record<string, unknown>;
} & RenderToStringOptions;

export type RenderFunction = (
  component: React.ReactElement,
  options?: RenderOptions,
) => string;

export type CookieOptions = {
  path?: string;
  domain?: string;
  maxAge?: number;
  expires?: Date;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "Lax" | "Strict" | "None";
};

export type Context = {
  params: Record<string, string>;
  query: Record<string, string>;
  remoteAddr: { transport: string; hostname?: string; port?: number };
  renderToString?: RenderFunction;
  cookies?: Record<string, string>;
  setCookie?: (name: string, value: string, opts?: CookieOptions) => void;
  url: URL;
  [key: string]: unknown;
};

export type Handler = (
  req: Request,
  context: Context,
  next?: Next,
) => Response | Promise<Response>;
export type Next = () => Response | Promise<Response>;
export type Middleware = (
  req: Request,
  context: Context,
  next: Next,
) => Response | Promise<Response>;

export interface Route {
  method: string;
  pattern: URLPattern;
  handler: Handler;
  paramNames: string[];
  middlewares: Middleware[];
}
