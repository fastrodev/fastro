/**
 * Local, minimal React typings to avoid importing the full React definitions
 * while still being type-compatible for our render helpers.
 *
 * These types intentionally mirror the public shapes from @types/react so
 * callers that expect `ReactElement`, `ReactNode`, etc. will continue to
 * type-check without requiring the React package at compile time.
 */

// deno-lint-ignore-file no-explicit-any
/**
 * A React element describes a tree node produced by JSX or `React.createElement`.
 *
 * @typeParam P - Props object for the element.
 * @typeParam T - Element type (string for intrinsic elements or a component constructor).
 */
export interface ReactElement<
  P = unknown,
  T extends string | JSXElementConstructor<any> =
    | string
    | JSXElementConstructor<any>,
> {
  type: T;
  props: P;
  key: string | null;
}

/**
 * A React portal represents a sub-tree that is rendered into a DOM node
 * outside the main DOM hierarchy (used in React's `ReactNode` union).
 */
export interface ReactPortal extends ReactElement {
  /** The children contained in the portal. */
  children: ReactNode;
}

/**
 * Values that React can render. This is a reduced-compatible version of the
 * `ReactNode` union from DefinitelyTyped and includes primitives, elements,
 * portals and iterables of nodes.
 */
export type ReactNode =
  | ReactElement
  | ReactPortal
  | string
  | number
  | bigint
  | Iterable<ReactNode>
  | boolean
  | null
  | undefined;

/**
 * A constructor or function that can produce a `ReactNode` given props.
 *
 * Function components return `ReactNode | null`. Class components are
 * represented here as constructors that accept props and produce an
 * instance (we keep the instance type `any` to remain flexible).
 */
type JSXElementConstructor<P = any> =
  | ((props: P) => ReactNode | null)
  | (new (props: P) => any);

/**
 * Options controlling low-level render-to-string behaviour.
 */
export type RenderToStringOptions = {
  /** Prefix applied to any auto-generated IDs during render. */
  identifierPrefix?: string;
  /** Optional AbortSignal to cancel rendering early. */
  signal?: AbortSignal;
  /** Provider used to generate a nonce for inline scripts (if needed). */
  nonceProvider?: () => string;
  /** Optional callback invoked when an internal render error occurs. */
  onError?: (error: unknown) => void;
};

/**
 * Higher-level render options including page metadata and initial props.
 * Combines with `RenderToStringOptions` for low-level control.
 */
export type RenderOptions = {
  /** Module path for the root/app component that is being rendered. */
  module?: string;
  /** Include the `<!DOCTYPE html>` prefix in the output. */
  includeDoctype?: boolean;
  /** Whether to render a `<head>` section. */
  includeHead?: boolean;
  /** Arbitrary HTML inserted into the document `<head>`. */
  head?: string;
  /** Page title to insert into the rendered HTML. */
  title?: string;
  /** Initial props passed to the top-level component at render time. */
  initialProps?: Record<string, unknown>;
} & RenderToStringOptions;

/**
 * Synchronous render function that accepts a `ReactElement` and options,
 * and returns the rendered HTML string.
 */
export type RenderFunction = (
  component: ReactElement,
  options?: RenderOptions,
) => string;
/**
 * Canonical render-to-string function signature used throughout the app.
 * Returns the HTML markup for the provided element.
 */
export type RenderToStringFunction = (
  component: ReactElement,
  options?: RenderOptions,
) => string;

/**
 * Options passed to helpers that set cookies on responses.
 */
export type CookieOptions = {
  /** Path attribute scope of the cookie. */
  path?: string;
  /** Domain attribute scope of the cookie. */
  domain?: string;
  /** Max-Age in seconds. */
  maxAge?: number;
  /** Absolute expiration date. */
  expires?: Date;
  /** Restrict cookie to secure (HTTPS) transport. */
  secure?: boolean;
  /** Mark cookie inaccessible to JavaScript. */
  httpOnly?: boolean;
  /** SameSite policy to mitigate CSRF. */
  sameSite?: "Lax" | "Strict" | "None";
};

/**
 * The request context passed to handlers and middlewares. Contains route
 * parameters, query data, utilities and per-request state.
 */
export type Context = {
  /** Parsed URL parameters (e.g., /users/:id -> { id: "123" }) */
  params: Record<string, string>;
  /** Parsed Query parameters (e.g., ?q=test -> { q: "test" }) */
  query: Record<string, string>;
  /** Remote address information of the client */
  remoteAddr: { transport: string; hostname?: string; port?: number };
  /** Utility to render a React component to a string */
  renderToString?: RenderToStringFunction;
  /** Incoming cookies as a key-value record */
  cookies?: Record<string, string>;
  /** Helper to set a cookie in the response */
  setCookie?: (name: string, value: string, opts?: CookieOptions) => void;
  /** Whether PWA is enabled */
  pwa?: boolean;
  /** Whether PWA is enabled (alias) */
  pwaEnabled?: boolean;
  /** PWA configuration */
  pwaConfig?: unknown;
  /** Full URL object of the request */
  url: URL;
  /** Deno KV instance, if the KV middleware is used */
  kv?: Deno.Kv;
  /** General purpose state object for middlewares */
  state?: any;
  /** Dynamic properties for middleware data passing */
  [key: string]: any;
};

/**
 * A route handler receives the `Request`, the parsed `Context`, and an
 * optional `next` function. It may return a `Response`, a string (which
 * will be wrapped as `text/plain`), a JSON-serializable object, or a
 * Promise resolving to one of those values.
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
 * Function used by middlewares/handlers to continue execution to the next
 * item in the middleware chain. Returns a `Response` (or a Promise of one).
 */
export type Next = () => Response | Promise<Response>;

/**
 * Middleware intercepts a request before it reaches the handler. It must
 * either return a `Response` to short-circuit the chain or call `next()`
 * to pass control onward.
 */
export type Middleware = (
  req: Request,
  context: Context,
  next: Next,
) => Response | Promise<Response>;

/**
 * Describes a registered route and its behaviour.
 */
export interface Route {
  /** HTTP method (GET, POST, etc.) */
  method: string;
  /** URL pattern used for matching incoming requests. */
  pattern: URLPattern;
  /** The handler invoked when the pattern matches. */
  handler: Handler;
  /** Ordered list of named URL parameters extracted from the pattern. */
  paramNames: string[];
  /** Per-route middleware stack executed before the handler. */
  middlewares: Middleware[];
}

/**
 * Router interface for registering HTTP routes. Each method registers a
 * handler for the given path and optional per-route middlewares.
 */
export interface Router {
  get(path: string, handler: Handler, ...middlewares: Middleware[]): unknown;
  post(path: string, handler: Handler, ...middlewares: Middleware[]): unknown;
  put(path: string, handler: Handler, ...middlewares: Middleware[]): unknown;
  delete(path: string, handler: Handler, ...middlewares: Middleware[]): unknown;
  patch?(path: string, handler: Handler, ...middlewares: Middleware[]): unknown;
  head?(path: string, handler: Handler, ...middlewares: Middleware[]): unknown;
  options?(
    path: string,
    handler: Handler,
    ...middlewares: Middleware[]
  ): unknown;
}
