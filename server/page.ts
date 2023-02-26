import { response } from "./response.ts";
import {
  Container,
  HandlerArgument,
  HttpRequest,
  RequestHandler,
  SSR,
  SSRHandler,
} from "./types.ts";

interface Page {
  pages: Map<string, SSRHandler>;
  set: (
    path: string,
    ssr: SSR,
    handler: HandlerArgument,
  ) => Page;
}

export function page(): Page {
  const LOCALHOST = "localhost";
  const pages: Map<string, SSRHandler> = new Map();

  const instance = {
    pages,
    set: (
      path: string,
      ssr: SSR,
      handler: HandlerArgument,
    ) => {
      const component = {
        path,
        ssr,
        handler,
      };
      pages.set(`GET#${LOCALHOST}#${path}`, component);
      return instance;
    },
  };

  return instance;
}

export function handleJSXPage(
  s: SSRHandler,
  r: HttpRequest,
  c: Container,
): Response | Promise<Response> {
  s.ssr.request(r);
  s.ssr.cache(c);
  const h = <RequestHandler> s.handler;
  return h(r, response(r), undefined);
}
