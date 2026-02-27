import type { Middleware } from "../../core/types.ts";

/**
 * Example `index` module exported in the root `manifest.ts`.
 * - Exports a named `index` middleware and a default export (same function)
 * - Responds to `/` with a simple text response, otherwise delegates to `next()`
 */
export const index: Middleware = (req, _ctx, next) => {
  const url = new URL(req.url);
  if (url.pathname === "/") {
    return new Response("Hello from modules/index", { status: 200 });
  }
  return next();
};

export default index;
