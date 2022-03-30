import { ConnInfo, Handler } from "./deps.ts";
import {
  AppMiddleware,
  HandlerArgument,
  MiddlewareArgument,
  PathArgument,
  RequestHandler,
  Route,
  Router,
} from "./types.ts";
import {
  INTERNAL_SERVER_ERROR_CODE,
  INTERNAL_SERVER_ERROR_MESSAGE,
  NOT_FOUND_CODE,
  NOT_FOUND_MESSAGE,
} from "./errors.ts";
import { router as appRouter } from "./router.ts";

interface HandlerRoute {
  method: string;
  path: PathArgument;
  url: string;
  host: string;
  handlers: HandlerArgument[];
}

interface HandlerMiddleware {
  type: string;
  path: PathArgument;
  url: string;
  host: string;
  middlewares: MiddlewareArgument[];
}

export function handler() {
  const EMPTY = "";
  const SLASH = "/";
  const DOUBLE_SLASH = "//";
  const HASHTAG = "#";
  const COLON = ":";
  const handlerRoutes: Map<string, HandlerRoute> = new Map();
  const handlerMiddlewares: HandlerMiddleware[] = [];

  let routerList: AppMiddleware[] = [];
  let hostname = EMPTY;

  function buildMiddleware(
    element: MiddlewareArgument,
    prefix: PathArgument,
    url: string,
  ) {
    const middlewares: AppMiddleware[] = [];
    let args: MiddlewareArgument[] = [];

    if (Array.isArray(element)) {
      args = <RequestHandler[]> element;
    } else {
      args.push(<RequestHandler> element);
    }

    middlewares.push({ path: `${prefix}/.*`, middlewares: args, type: "" });
    initHandlerMiddlewares(middlewares, url);
  }

  function buildRoutes(router: Router, prefix: PathArgument, url: string) {
    const r = appRouter();
    router.routes.forEach((element) => {
      const path = element.path !== "/" ? element.path : "";
      const newPath = `${prefix}${path}`;
      if (element.method === "GET") r.get(newPath, ...element.handlers);
      if (element.method === "POST") r.post(newPath, ...element.handlers);
      if (element.method === "PUT") r.put(newPath, ...element.handlers);
      if (element.method === "DELETE") r.delete(newPath, ...element.handlers);
      if (element.method === "OPTIONS") r.options(newPath, ...element.handlers);
      if (element.method === "HEAD") r.head(newPath, ...element.handlers);
      if (element.method === "PATCH") r.patch(newPath, ...element.handlers);
    });
    initHandlerRoutes(r.routes, url);
  }

  function isRouter(element: Router) {
    return element.routes !== undefined;
  }

  function loopRouterMiddleware(
    object: MiddlewareArgument[],
    prefix: PathArgument,
    url: string,
  ) {
    object.forEach((element) => {
      if (isRouter(<Router> element)) {
        buildRoutes(<Router> element, prefix, url);
      } else {
        buildMiddleware(element, prefix, url);
      }
    });
  }

  function handleRouterMiddleware(array: AppMiddleware[], url: string) {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      loopRouterMiddleware(element.middlewares, element.path, url);
    }
  }

  function handleRequest(
    req: Request,
    connInfo: ConnInfo,
    routes: Map<string, Route>,
    middlewares: AppMiddleware[],
  ): Response | Promise<Response> {
    if (handlerMiddlewares.length < 1) {
      routerList = initHandlerMiddlewares(middlewares, req.url);
      if (routerList.length > 0) {
        handleRouterMiddleware(routerList, req.url);
      }
    }

    if (handlerRoutes.size < 1) {
      initHandlerRoutes(routes, req.url);
    }

    if (handlerMiddlewares.length > 0) {
      const done = processHandlerMiddleware(handlerMiddlewares, req, connInfo);
      if (!done) throw Error("Middleware execution not finished");
    }

    const res = handlerRoutes.get(createMapKey(req));
    if (!res) {
      return new Response(NOT_FOUND_MESSAGE, { status: NOT_FOUND_CODE });
    }

    const { length, [length - 1]: handler } = res.handlers;
    if (length > 1) return loopHandlers(res, req, connInfo);
    if (!isHandler(handler)) throw new Error("The argument must be a handler");
    const appHandler = <Handler> handler;
    return appHandler(req, connInfo);
  }

  function processHandlerMiddleware(
    handlerMiddlewares: HandlerMiddleware[],
    req: Request,
    connInfo: ConnInfo,
  ) {
    const m = handlerMiddlewares.filter((v) => {
      return (v.url === createArrayKey(req));
    });

    for (let index = 0; index < m.length; index++) {
      const done = loopHandlerMiddleware(m[index].middlewares, req, connInfo);
      if (!done) return false;
    }
    return true;
  }

  function loopHandlerMiddleware(
    m: MiddlewareArgument[],
    req: Request,
    connInfo: ConnInfo,
  ) {
    for (let index = 0; index < m.length; index++) {
      const handler = m[index];
      let done = false;

      if (Array.isArray(handler)) {
        done = loopExecute(handler, req, connInfo);
      } else done = execute(<RequestHandler> handler, req, connInfo);

      if (!done) return false;
    }
    return true;
  }

  function loopHandlers(res: HandlerRoute, req: Request, connInfo: ConnInfo) {
    for (let index = 0; index < res.handlers.length; index++) {
      const handler = res.handlers[index];
      let done = false;
      if (index === res.handlers.length - 1) {
        if (!isHandler(handler)) {
          throw new Error("The last argument must be a handler");
        }
        const appHandler = <Handler> handler;
        return appHandler(req, connInfo);
      }

      if (Array.isArray(handler)) done = loopExecute(handler, req, connInfo);
      else done = execute(handler, req, connInfo);

      if (!done) throw new Error("Middleware execution not finished");
    }

    return new Response(INTERNAL_SERVER_ERROR_MESSAGE, {
      status: INTERNAL_SERVER_ERROR_CODE,
    });
  }

  function loopExecute(
    handlers: RequestHandler[],
    req: Request,
    connInfo: ConnInfo,
  ) {
    for (let index = 0; index < handlers.length; index++) {
      const handler = handlers[index];
      const done = execute(handler, req, connInfo);
      if (!done) return false;
    }

    return true;
  }

  function execute(handler: RequestHandler, req: Request, connInfo: ConnInfo) {
    if (!isRequestHandler(handler)) throw new Error("Invalid middleware");
    return handleMiddleware(req, connInfo, <RequestHandler> handler);
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

  function createArrayKey(req: Request): string {
    let result = EMPTY;
    handlerMiddlewares.forEach((v) => {
      if (
        validateURL(v.url, req.url, v.host, v.path)
      ) {
        result = `${v.url}`;
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

  function isRequestHandler(
    handler: HandlerArgument,
  ): handler is RequestHandler {
    const req = <RequestHandler> handler;
    return req.length === 3;
  }

  function isHandler(
    handler: HandlerArgument,
  ): handler is Handler {
    const req = <Handler> handler;
    return req.length <= 2;
  }

  function initHandlerMiddlewares(middlewares: AppMiddleware[], url: string) {
    const [http, path] = url.split(DOUBLE_SLASH);
    const [host] = path.split(SLASH);
    hostname = `${http}${DOUBLE_SLASH}${host}`;

    const middlewareList = middlewares.filter((v) => {
      return v.type !== "router";
    });

    const routerList = middlewares.filter((v) => {
      return v.type === "router";
    });

    middlewareList.forEach((m) => {
      const mdl: HandlerMiddleware = {
        type: m.type,
        path: m.path,
        middlewares: m.middlewares,
        url: `${hostname}${m.path}`,
        host: hostname,
      };
      handlerMiddlewares.push(mdl);
    });

    middlewares = [];
    return routerList;
  }

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

  function createHandler(
    routes: Map<string, Route>,
    middlewares: AppMiddleware[],
  ) {
    return function (
      req: Request,
      connInfo: ConnInfo,
    ): Response | Promise<Response> {
      return handleRequest(req, connInfo, routes, middlewares);
    };
  }

  return {
    createHandler,
    getParams,
    getParam,
  };
}
