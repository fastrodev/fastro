import type { Context, Next } from "../../core/types.ts";

/**
 * A standard request logger that tracks start time and logs the request method and path.
 */
export function logger(req: Request, ctx: Context, next: Next) {
  const start = Date.now();

  // Attach data to the shared context state
  // Using dynamic property as defined in Context type
  if (!ctx.state) {
    ctx.state = {};
  }
  (ctx.state as Record<string, unknown>).startTime = start;

  console.log(
    `[${new Date().toISOString()}] ${req.method} ${ctx.url.pathname}`,
  );

  return next();
}
