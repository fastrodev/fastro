import type { Middleware } from "../../core/types.ts";

export type CorsOptions = {
    origin?: string | string[] | RegExp | ((origin: string | null) => string | boolean | null | undefined);
    allowMethods?: string[];
    allowHeaders?: string[];
    exposeHeaders?: string[];
    credentials?: boolean;
    maxAge?: number; // seconds
    preflightContinue?: boolean; // if true, pass preflight to next(), else respond
    optionsSuccessStatus?: number; // default 204
};

/**
 * CORS middleware factory that creates a middleware to handle Cross-Origin Resource Sharing.
 * 
 * This middleware:
 * - Checks for Origin header in requests
 * - Resolves allowed origins based on the provided options (string, array, regex, or function)
 * - Handles preflight OPTIONS requests by setting appropriate CORS headers
 * - Adds CORS headers to actual requests
 * - Supports credentials, custom methods, headers, and max-age
 * - Properly manages Vary headers for caching
 * 
 * @param options - Configuration options for CORS behavior
 * @returns A middleware function that handles CORS for requests
 */
export function cors(options: CorsOptions = {}): Middleware {
    const {
        origin = "*",
        allowMethods = ["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowHeaders,
        exposeHeaders,
        credentials = false,
        maxAge,
        preflightContinue = false,
        optionsSuccessStatus = 204,
    } = options;

    const resolveOrigin = (requestOrigin: string): string | null => {
        if (typeof origin === "function") {
            const res = origin(requestOrigin);
            if (res === true) return requestOrigin;
            if (typeof res === "string") return res;
            return res ? requestOrigin : null;
        }

        if (typeof origin === "string") {
            if (origin === "*") return "*";
            return origin === requestOrigin ? requestOrigin : null;
        }

        if (Array.isArray(origin)) {
            return origin.includes(requestOrigin) ? requestOrigin : null;
        }

        if (origin instanceof RegExp) {
            return origin.test(requestOrigin) ? requestOrigin : null;
        }

        return null;
    };

    const applyOrigin = (headers: Headers, requestOrigin: string, resolved: string): void => {
        if (credentials && resolved === "*") {
            // Cannot use "*" with credentials; reflect the request origin instead.
            headers.set("Access-Control-Allow-Origin", requestOrigin);
            headers.append("Vary", "Origin");
        } else {
            headers.set("Access-Control-Allow-Origin", resolved);
            if (resolved !== "*") {
                headers.append("Vary", "Origin");
            }
        }
        if (credentials) {
            headers.set("Access-Control-Allow-Credentials", "true");
        }
    };

    return async (req, _ctx, next) => {
        const requestOrigin = req.headers.get("Origin");
        const isPreflight =
            req.method === "OPTIONS" &&
            requestOrigin !== null &&
            req.headers.get("Access-Control-Request-Method") !== null;

        // If no Origin header, it's not a CORS request.
        if (!requestOrigin) {
            return next();
        }

        const resolved = resolveOrigin(requestOrigin);
        // If origin not allowed, proceed without CORS headers.
        if (!resolved) {
            return next();
        }

        if (isPreflight) {
            const resHeaders = new Headers();
            applyOrigin(resHeaders, requestOrigin, resolved);

            // Allow-Methods
            resHeaders.set("Access-Control-Allow-Methods", allowMethods.join(", "));

            // Allow-Headers (requested or configured)
            const reqAllowed = req.headers.get("Access-Control-Request-Headers");
            if (allowHeaders && allowHeaders.length > 0) {
                resHeaders.set("Access-Control-Allow-Headers", allowHeaders.join(", "));
            } else if (reqAllowed) {
                resHeaders.set("Access-Control-Allow-Headers", reqAllowed);
                resHeaders.append("Vary", "Access-Control-Request-Headers");
            }

            // Max-Age
            if (typeof maxAge === "number") {
                resHeaders.set("Access-Control-Max-Age", String(maxAge));
            }

            if (preflightContinue) {
                // Pass through but ensure headers are present on final response too
                const response = await next();
                for (const [k, v] of resHeaders.entries()) {
                    response.headers.set(k, v);
                }
                return response;
            }

            return new Response(null, { status: optionsSuccessStatus, headers: resHeaders });
        }

        // Simple/actual request: add CORS headers to the response.
        const response = await next();

        applyOrigin(response.headers, requestOrigin, resolved);

        if (exposeHeaders && exposeHeaders.length > 0) {
            response.headers.set("Access-Control-Expose-Headers", exposeHeaders.join(", "));
        }

        return response;
    };
}

/**
 * Permissive default CORS middleware:
 * - Allows any origin (no credentials)
 * - Standard methods
 */
export const corsMiddleware: Middleware = cors();