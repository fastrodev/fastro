import { ConnInfo, Handler } from "./deps.ts";
import {
  HandlerArgument,
  PathArgument,
  RequestHandler,
  Route,
} from "./types.ts";
import {
  INTERNAL_SERVER_ERROR_CODE,
  INTERNAL_SERVER_ERROR_MESSAGE,
  NOT_FOUND_CODE,
  NOT_FOUND_MESSAGE,
} from "./errors.ts";

export interface HandlerRoute {
  method: string;
  path: PathArgument;
  url: string;
  host: string;
  handlers: HandlerArgument[];
}

export function handler() {
  const EMPTY = "";
  const SLASH = "/";
  const DOUBLE_SLASH = "//";
  const HASHTAG = "#";
  const COLON = ":";
  const handlerRoutes: Map<string, HandlerRoute> = new Map();

  let hostname = EMPTY;

  function initHandlerRoutes(
    map: Map<string, Route>,
    url: string,
  ) {
    const [http, path] = url.split(DOUBLE_SLASH);
    const [host] = path.split(SLASH);
    hostname = `${http}${DOUBLE_SLASH}${host}`;
    map.forEach((v, k) => {
      const [method, , kpath] = k.split(HASHTAG);
      const key = `${method}:${hostname}${kpath}`;
      handlerRoutes.set(key, {
        method: v.method,
        path: v.path,
        url: `${hostname}${kpath}`,
        host: hostname,
        handlers: v.handlers,
      });
    });
    map.clear();
  }

  function handleRequest(
    req: Request,
    connInfo: ConnInfo,
    appRoutes: Map<string, Route>,
  ): Response | Promise<Response> {
    if (handlerRoutes.size < 1) {
      initHandlerRoutes(appRoutes, req.url);
    }

    const res = handlerRoutes.get(createMapKey(req));
    if (!res) {
      return new Response(NOT_FOUND_MESSAGE, { status: NOT_FOUND_CODE });
    }

    const { length, [length - 1]: handler } = res.handlers;
    if (length === 1) {
      if (!isHandler(handler)) {
        throw new Error("The argument must be a handler");
      }
      const appHandler = <Handler> handler;
      return appHandler(req, connInfo);
    }

    for (let index = 0; index < res.handlers.length; index++) {
      const handler = res.handlers[index];
      if (index === res.handlers.length - 1) {
        if (!isHandler(handler)) {
          throw new Error("The last argument must be a handler");
        }
        const appHandler = <Handler> handler;
        return appHandler(req, connInfo);
      }

      if (!isRequestHandler(handler)) {
        throw new Error("Invalid middleware");
      }
      const done = handleMiddleware(req, connInfo, <RequestHandler> handler);
      if (!done) {
        throw new Error("Middleware execution not finished");
      }
    }

    return new Response(INTERNAL_SERVER_ERROR_MESSAGE, {
      status: INTERNAL_SERVER_ERROR_CODE,
    });
  }

  function handleMiddleware(
    req: Request,
    connInfo: ConnInfo,
    middleware: RequestHandler,
  ) {
    let done = false;
    middleware(req, connInfo, (err) => {
      if (err) {
        throw err;
      }
      done = true;
    });
    return done;
  }

  function createMapKey(req: Request): string {
    let result = EMPTY;
    handlerRoutes.forEach((v) => {
      if (
        v.method === req.method && validateURL(v.url, req.url, v.host, v.path)
      ) {
        result = `${req.method}${COLON}${v.url}`;
      }
    });
    return result;
  }

  function isRegex(regexPath: PathArgument) {
    return regexPath instanceof RegExp;
  }

  function validateURL(
    routeURL: string,
    incomingURL: string,
    host: string,
    regexPath: PathArgument,
  ) {
    const incomingPath = incomingURL.replace(host, EMPTY).split(SLASH);
    if (isRegex(regexPath)) {
      const regex = new RegExp(regexPath);
      return regex.test(incomingPath[1]);
    }
    const routePath = routeURL.replace(host, EMPTY).split(SLASH);
    if (routePath.length != incomingPath.length) return false;
    return parsePath(routePath, incomingPath);
  }

  function parsePath(route: string[], incoming: string[]) {
    route.shift();
    incoming.shift();
    for (let idx = 0; idx < route.length; idx++) {
      if (!isValidPath(route[idx], incoming, idx)) return false;
    }
    return true;
  }

  function isValidPath(path: string, incoming: string[], idx: number) {
    return (path === incoming[idx] || regex(incoming[idx], path));
  }

  function regex(incoming: string, path: string) {
    if (path) {
      if (path.charAt(0) === COLON) return true;
      const regex = new RegExp(path);
      return regex.test(incoming);
    }
    return false;
  }

  function getRoute(req: Request): string {
    let result = EMPTY;
    handlerRoutes.forEach((v) => {
      if (
        v.method === req.method && validateURL(v.url, req.url, v.host, v.path)
      ) {
        result = v.url;
      }
    });
    return result;
  }

  function extractParams(req: Request) {
    const routeParams = getRoute(req).replace(hostname, EMPTY).split(SLASH);
    const params = req.url.replace(hostname, EMPTY).split(SLASH);
    routeParams.shift();
    params.shift();
    return routeParams
      .map((val, idx) => {
        return { val, idx };
      })
      .filter((v) => v.val.charAt(0) === COLON)
      .map((v) => {
        return {
          name: v.val.replace(COLON, EMPTY),
          value: params[v.idx],
        };
      });
  }

  function getParams(req: Request) {
    const obj: Record<string, string> = {};
    extractParams(req).forEach((val) => obj[val.name] = val.value);
    return obj;
  }

  function getParam(name: string, req: Request) {
    const [res] = extractParams(req).filter((val) => val.name === name);
    return res.value;
  }

  function createHandler(appRoutes: Map<string, Route>) {
    return function (
      req: Request,
      connInfo: ConnInfo,
    ): Response | Promise<Response> {
      return handleRequest(req, connInfo, appRoutes);
    };
  }

  return {
    createHandler,
    getParams,
    getParam,
  };
}

export function isRequestHandler(
  handler: HandlerArgument,
): handler is RequestHandler {
  const req = <RequestHandler> handler;
  return req.length === 3;
}

export function isHandler(
  handler: HandlerArgument,
): handler is Handler {
  const req = <Handler> handler;
  return req.length <= 2;
}
