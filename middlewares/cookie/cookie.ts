import type { Middleware } from "../../core/types.ts";

export type CookieOptions = {
  path?: string;
  domain?: string;
  maxAge?: number;
  expires?: Date;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "Lax" | "Strict" | "None";
};

function parseCookies(header: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const eq = trimmed.indexOf("=");
    const name = eq >= 0 ? trimmed.slice(0, eq) : trimmed;
    const val = eq >= 0 ? trimmed.slice(eq + 1) : "";
    out[name] = decodeURIComponent(val);
  }
  return out;
}

function formatCookie(
  name: string,
  value: string,
  opts?: CookieOptions,
): string {
  const parts: string[] = [];
  parts.push(`${name}=${encodeURIComponent(value)}`);
  if (opts?.maxAge !== undefined) {
    parts.push(`Max-Age=${Math.floor(opts.maxAge)}`);
  }
  if (opts?.expires) parts.push(`Expires=${opts.expires.toUTCString()}`);
  if (opts?.domain) parts.push(`Domain=${opts.domain}`);
  if (opts?.path) parts.push(`Path=${opts.path}`);
  if (opts?.secure) parts.push("Secure");
  if (opts?.httpOnly) parts.push("HttpOnly");
  if (opts?.sameSite) parts.push(`SameSite=${opts.sameSite}`);
  return parts.join("; ");
}

export const cookieMiddleware: Middleware = async (req, context, next) => {
  context.cookies = parseCookies(req.headers.get("cookie") ?? "");

  const pending: string[] = [];
  context.setCookie = (name: string, value: string, opts?: CookieOptions) => {
    pending.push(formatCookie(name, value, opts));
  };

  const res = await next();

  if (pending.length === 0) return res;

  const headers = new Headers(res.headers);
  for (const c of pending) headers.append("Set-Cookie", c);

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
};
