import { response } from "./response.ts";
import { HandlerArgument, HttpRequest, SSR, SSRHandler } from "./types.ts";

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
  ssr: SSRHandler,
  req: HttpRequest,
): Response | Promise<Response> {
  return ssr.handler(req, response(req), () => {});
}
