import type { Context, Next } from "../../core/types.ts";

/**
 * A standard request logger that tracks start time and logs the request method, path,
 * response status, and latency. Optimized for DevOps monitoring.
 */
export async function logger(req: Request, ctx: Context, next: Next) {
  const start = Date.now();

  if (!ctx.state) {
    ctx.state = {};
  }
  (ctx.state as Record<string, unknown>).startTime = start;

  const res = await next();
  const duration = Date.now() - start;
  const status = res.status;
  const method = req.method;
  const path = ctx.url.pathname;
  const ip = ctx.remoteAddr?.hostname || "127.0.0.1";
  const timestamp = new Date().toISOString();
  const level = status >= 500 ? "ERROR" : status >= 400 ? "WARN" : "INFO";

  console.log(
    `[${timestamp}] ${level} ${method} ${path} ${status} ${duration}ms - ${ip}`,
  );

  return res;
}
