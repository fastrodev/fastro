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
  /** Registers a global middleware. */
  use = server.use;
  /** Starts the HTTP server. */
  serve = server.serve;
}

import { autoRegisterModules } from "./core/loader.ts";
import { createRouter } from "./core/router.ts";

/**
 * Automatically registers modules from a directory.
 */
export { autoRegisterModules };

/**
 * Creates a new router instance for modular routing.
 */
export { createRouter };
