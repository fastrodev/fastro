/**
 * Fastro - A high-performance, minimalist web framework for Deno.
 *
 * This module provides the core features to build fast web applications,
 * including routing, middleware, and automatic module loading.
 *
 * @example
 * ```ts
 * import server from "https://deno.land/x/fastro/mod.ts";
 *
 * server.get("/", () => "Hello World");
 * await server.serve();
 * ```
 */

import type { Context, Handler, Middleware, Next } from "./core/types.ts";
import { createRouter } from "./core/router.ts";
import { autoRegisterModules } from "./core/loader.ts";
export { autoRegisterModules, createRouter };
export type { Context, Handler, Middleware, Next };

import server from "./core/server.ts";
const modules = { ...server };
/**
 * Default export providing the main server interface.
 */
export default modules;
