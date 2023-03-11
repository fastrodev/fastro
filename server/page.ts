import { response } from "./response.ts";
import { Container, HttpRequest, RequestHandler, SSRHandler } from "./types.ts";

export function handleJSXPage(
  s: SSRHandler,
  r: HttpRequest,
  c: Container,
): Response | Promise<Response> {
  s.ssr.request(r);
  s.ssr.cache(c);
  const h = <RequestHandler> s.handler;
  return h(r, response(r));
}
