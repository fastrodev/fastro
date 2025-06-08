import { HttpRequest } from "../core/server/types.ts";

export const ALLOWED_ORIGINS = [
  "https://social.fastro.dev",
  "https://web.fastro.dev", // Add other allowed origins here
  "http://localhost:8000", // Example for local development
];

export const BASE_CORS_HEADERS = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Max-Age": "86400",
};

export function getCorsHeaders(req: HttpRequest): Record<string, string> {
  const origin = req.headers.get("origin");
  const headers: Record<string, string> = { ...BASE_CORS_HEADERS };
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  console.log("CORS headers:", headers);
  return headers;
}
