import React from "npm:react@^19.2.4";

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

/**
 * The execution context for a request.
 * Contains request parameters, query data, and utility functions like cookies or rendering.
 * You can also attach custom data to this object to pass information between middlewares.
 */
export type Context = {
  /** Parsed URL parameters (e.g., /users/:id -> { id: "123" }) */
  params: Record<string, string>;
  /** Parsed Query parameters (e.g., ?q=test -> { q: "test" }) */
  query: Record<string, string>;
  /** Remote address information of the client */
  remoteAddr: { transport: string; hostname?: string; port?: number };
  /** Utility to render a React component to a string */
  renderToString?: RenderFunction;
  /** Incoming cookies as a key-value record */
  cookies?: Record<string, string>;
  /** Helper to set a cookie in the response */
  setCookie?: (name: string, value: string, opts?: CookieOptions) => void;
  /** Full URL object of the request */
  url: URL;
  /** Dynamic properties for middleware data passing */
  [key: string]: unknown;
};

/**
 * A function that handles a specific route.
 * Handlers can return a standard `Response`, a raw `string` (which will be
 * converted to a text/plain response), an object (which will be converted
 * to a JSON response), or a Promise of either.
 */
export type Handler = (
  req: Request,
  context: Context,
  next?: Next,
) =>
  | Response
  | Promise<Response>
  | string
  | Promise<string>
  | Record<string, unknown>
  | Promise<Record<string, unknown>>;

/**
 * A function to continue execution to the next item in the middleware chain.
 */
export type Next = () => Response | Promise<Response>;

/**
 * A function that intercepts a request before it reaches the handler.
 * Middlewares must call `next()` to continue the chain, or return a
 * `Response` to terminate it early.
 */
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
