import type { Middleware } from "../../core/types.ts";

export function createKvMiddleware(path?: string): Middleware {
  let kvPromise: Promise<Deno.Kv> | null = null;
  return async (_req, ctx, next) => {
    if (!kvPromise) {
      // Support an in-memory KV for tests when path === ":memory:"
      if (path === ":memory:") {
        const map = new Map<string, unknown>();
        const memKv = {
          get: (key: unknown) => {
            const k = JSON.stringify(key);
            const value = map.has(k) ? map.get(k) : null;
            return Promise.resolve({ key, value });
          },
          set: (key: unknown, value: unknown) => {
            const k = JSON.stringify(key);
            map.set(k, value);
            return Promise.resolve({ key });
          },
          delete: (key: unknown) => {
            const k = JSON.stringify(key);
            map.delete(k);
            return Promise.resolve({ key });
          },
          close: () => {
            map.clear();
            return Promise.resolve();
          },
        } as unknown as Deno.Kv;
        kvPromise = Promise.resolve(memKv);
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
