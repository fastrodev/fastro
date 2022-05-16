import { ConnInfo, Handler } from "./deps.ts";
import { PathArgument, SSR, SSRHandler } from "./types.ts";

interface Page {
  pages: Map<string, SSRHandler>;
  set: (
    path: PathArgument,
    ssr: SSR,
    handler: Handler,
  ) => Page;
}

export function page(): Page {
  const LOCALHOST = "localhost";
  const pages: Map<string, SSRHandler> = new Map();

  const instance = {
    pages,
    set: (
      path: PathArgument,
      ssr: SSR,
      handler: Handler,
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
  req: Request,
  connInfo: ConnInfo,
): Response | Promise<Response> {
  return ssr.handler(req, connInfo);
}
