import React from "npm:react@^19.2.4";

/**
 * Options for rendering a React component to a string.
 */
export type RenderToStringOptions = {
  /** Prefix for generated IDs */
  identifierPrefix?: string;
  /** Signal to abort the rendering process */
  signal?: AbortSignal;
  /** Provider for nonce strings to be used in script tags */
  nonceProvider?: () => string;
  /** Callback for error handling during rendering */
  onError?: (error: unknown) => void;
};

/**
 * Enhanced options for rendering, including page metadata and component props.
 */
export type RenderOptions = {
  /** The entry point module for the application */
  module?: string;
  /** Whether to include the <!DOCTYPE html> declaration */
  includeDoctype?: boolean;
  /** Whether to include the <head> element */
  includeHead?: boolean;
  /** Custom HTML content to be inserted into the <head> */
  head?: string;
  /** Page title */
  title?: string;
  /** Initial props to be passed to the React component */
  initialProps?: Record<string, unknown>;
} & RenderToStringOptions;

/**
 * Function type for rendering a React component.
 */
export type RenderFunction = (
  component: React.ReactElement,
  options?: RenderOptions,
) => string;

/**
 * Options for setting a cookie.
 */
export type CookieOptions = {
  /** Path scope of the cookie */
  path?: string;
  /** Domain scope of the cookie */
  domain?: string;
  /** Maximum age of the cookie in seconds */
  maxAge?: number;
  /** Expiration date of the cookie */
  expires?: Date;
  /** Whether the cookie should only be sent over HTTPS */
  secure?: boolean;
  /** Whether the cookie is inaccessible to client-side scripts */
  httpOnly?: boolean;
  /** SameSite attribute for CSRF protection */
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
  /** Deno KV instance, if the KV middleware is used */
  kv?: Deno.Kv;
  /** General purpose state object for middlewares */
  // deno-lint-ignore no-explicit-any
  state?: any;
  /** Dynamic properties for middleware data passing */
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
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

/**
 * Defines a route's structure and behavior.
 */
export interface Route {
  /** HTTP method (GET, POST, etc.) */
  method: string;
  /** URL pattern for matching */
  pattern: URLPattern;
  /** Route handler function */
  handler: Handler;
  /** Names of URL parameters extracted from the pattern */
  paramNames: string[];
  /** Route-specific middlewares */
  middlewares: Middleware[];
}
