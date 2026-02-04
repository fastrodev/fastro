import type { Middleware, Context } from "../../core/types.ts";

export function createKvMiddleware(path?: string): Middleware {
    let kvPromise: Promise<Deno.Kv> | null = null;
    return async (_req, ctx, next) => {
        if (!kvPromise) {
            if (typeof Deno.openKv !== "function") {
                console.warn("Deno.openKv is not available. Ensure you are running with --unstable-kv flag.");
                return next();
            }
            kvPromise = Deno.openKv(path);
        }
        (ctx as Context & { kv?: Deno.Kv }).kv = await kvPromise;
        return next();
    };
}
export const kvMiddleware: Middleware = createKvMiddleware();

