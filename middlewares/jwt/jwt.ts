import type { Middleware } from "../../core/types.ts";

/**
 * JWT middleware options
 */
export type JwtOptions = {
  /** The secret key used to sign and verify tokens */
  secret: string;
};

/**
 * Encodes a Uint8Array to base64url string
 */
function base64urlEncode(data: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...data));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Decodes a base64url string to Uint8Array
 */
function base64urlDecode(s: string): Uint8Array {
  let base64 = s.replace(/-/g, "+").replace(/_/g, "/");
  // pad to multiple of 4
  const pad = (4 - (base64.length % 4)) % 4;
  if (pad) base64 += "=".repeat(pad);
  const binString = atob(base64);
  const data = new Uint8Array(binString.length);
  for (let i = 0; i < binString.length; i++) {
    data[i] = binString.charCodeAt(i);
  }
  return data;
}

/**
 * Generates an HMAC SHA-256 signature
 */
async function sign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(data),
  );
  return base64urlEncode(new Uint8Array(signature));
}

/**
 * Creates a JWT token
 */
export async function createToken(
  payload: Record<string, unknown>,
  secret: string,
): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const headerPart = base64urlEncode(
    new TextEncoder().encode(JSON.stringify(header)),
  );
  const payloadPart = base64urlEncode(
    new TextEncoder().encode(JSON.stringify(payload)),
  );
  const data = `${headerPart}.${payloadPart}`;
  const signature = await sign(data, secret);
  return `${data}.${signature}`;
}

/**
 * Verifies a JWT token and returns the payload if valid
 */
export async function verifyToken<T = Record<string, unknown>>(
  token: string,
  secret: string,
): Promise<T | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerPart, payloadPart, signaturePart] = parts;
  const data = `${headerPart}.${payloadPart}`;
  const expectedSignature = await sign(data, secret);

  if (signaturePart !== expectedSignature) return null;

  try {
    const payloadJson = new TextDecoder().decode(base64urlDecode(payloadPart));
    const payload = JSON.parse(payloadJson);

    // Check expiration if present
    if (payload.exp && typeof payload.exp === "number") {
      if (Date.now() >= payload.exp * 1000) {
        return null;
      }
    }

    return payload as T;
  } catch (_e) {
    return null;
  }
}

/**
 * Fastro JWT middleware
 *
 * This middleware:
 * 1. Extracts the Bearer token from the Authorization header
 * 2. Verifies the token using the provided secret
 * 3. Populates `ctx.state.user` with the decoded payload if valid
 * 4. Returns 401 Unauthorized if the token is missing or invalid
 */
export function jwt(options: JwtOptions): Middleware {
  return async (req, ctx, next) => {
    // Try Authorization header first, then fallback to `Cookie: token=...`
    let token: string | null = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const m = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
        if (m) token = decodeURIComponent(m[1]);
      }
    }

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }
    const payload = await verifyToken(token, options.secret);

    if (!payload) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Attach payload to context state
    if (!ctx.state) ctx.state = {};
    ctx.state.user = payload;
    return next();
  };
}
