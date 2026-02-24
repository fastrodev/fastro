import type { Context, Handler, Middleware, Next } from "./core/types.ts";
export type { Context, Handler, Middleware, Next };

import server from "./core/server.ts";

/**
 * Main class for the Fastro framework.
 *
 * Provides a minimalist and ultra-fast API for building web applications
 * in Deno, featuring intelligent LRU caching and zero-dependency routing.
 */
export default class Fastro {
  /** Registers a GET route. */
  get = server.get;
  /** Registers a POST route. */
  post = server.post;
  /** Registers a PUT route. */
  put = server.put;
  /** Registers a DELETE route. */
  delete = server.delete;
  /** Registers a PATCH route. */
  patch = server.patch;
  /** Registers a HEAD route. */
  head = server.head;
  /** Registers an OPTIONS route. */
  options = server.options;
  /** Registers a global middleware. */
  use = server.use;
  /** Starts the HTTP server. */
  serve = server.serve;
}
