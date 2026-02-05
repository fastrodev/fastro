import type { Middleware } from "../../core/types.ts";

export function createKvMiddleware(path?: string): Middleware {
  let kvPromise: Promise<Deno.Kv> | null = null;
  return async (_req, ctx, next) => {
    if (!kvPromise) {
      // Support an in-memory KV for tests when path === ":memory:"
      if (path === ":memory:") {
        const map = new Map<string, unknown>();
        const memKv: Partial<Deno.Kv> = {
          async get(key: unknown) {
            const k = JSON.stringify(key);
            if (!map.has(k)) return { key, value: null } as any;
            return { key, value: map.get(k) } as any;
          },
          async set(key: unknown, value: unknown) {
            const k = JSON.stringify(key);
            map.set(k, value);
            return { key } as any;
          },
          async delete(key: unknown) {
            const k = JSON.stringify(key);
            map.delete(k);
            return { key } as any;
          },
          async close() {
            map.clear();
          },
        };
        kvPromise = Promise.resolve(memKv as Deno.Kv);
      } else {
        if (typeof Deno.openKv !== "function") {
          console.warn(
            "Deno.openKv is not available. Ensure you are running with --unstable-kv flag.",
          );
          return next();
        }
        kvPromise = Deno.openKv(path);
      }
    }
    ctx.kv = await kvPromise;
    return next();
  };
}
export const kvMiddleware: Middleware = createKvMiddleware();
