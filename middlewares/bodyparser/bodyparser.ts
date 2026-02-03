import { Context, Middleware } from "../../mod.ts";

export type BodyState = {
  json?: unknown;
  formData?: FormData;
  text?: string;
  bytes?: Uint8Array;
  bodyError?: Error;
  _parsed?: boolean;
};

export type BodyParserContext = Context & { state?: BodyState };

/**
 * Middleware that parses the request body based on the Content-Type header for POST, PUT, and PATCH requests.
 * It stores the parsed data in ctx.state for later use by handlers.
 * Supports application/json, multipart/form-data, application/x-www-form-urlencoded, text/*, and raw bytes.
 * Prevents multiple parsing by checking a _parsed flag.
 * If parsing fails, stores the error in ctx.state.bodyError.
 *
 * @param req - The incoming Request object.
 * @param ctx - The context object, extended with state.
 * @param next - The next middleware function.
 * @returns The result of calling next().
 */
export const bodyParser: Middleware = async (req, ctx, next) => {
  const method = req.method;
  if (!["POST", "PUT", "PATCH"].includes(method)) return next();

  const extendedCtx = ctx as BodyParserContext;
  if (!extendedCtx.state) extendedCtx.state = {};
  const state = extendedCtx.state;

  // Avoid parsing multiple times
  if (state._parsed) return next();

  const ct = req.headers.get("content-type") || "";
  if (ct.length === 0) return next();

  try {
    if (ct.includes("application/json")) {
      state.json = await req.json();
    } else if (ct.includes("multipart/form-data")) {
      state.formData = await req.formData();
    } else if (ct.includes("application/x-www-form-urlencoded")) {
      state.formData = await req.formData();
    } else if (ct.startsWith("text/")) {
      state.text = await req.text();
    } else {
      state.bytes = new Uint8Array(await req.arrayBuffer());
    }
    state._parsed = true;
  } catch (e) {
    console.error("Body parse failed:", e);
    state.bodyError = e as Error;
  }

  return next();
};
