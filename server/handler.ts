import {
  ConnInfo,
  Handler,
  ReactDOMServer,
  Status,
  STATUS_TEXT,
} from "./deps.ts";
import {
  AppMiddleware,
  HandlerArgument,
  MiddlewareArgument,
  PathArgument,
  RequestHandler,
  Route,
  Router,
  SSR,
  SSRHandler,
  StringHandler,
} from "./types.ts";
import { router as appRouter } from "./router.ts";
import { handleStaticFile } from "./static.ts";
import { handleJSXPage } from "./page.ts";

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

export function render(element: JSX.Element) {
  const component = ReactDOMServer.renderToString(element);
  return new Response(component, {
    headers: {
      "content-type": "text/html",
    },
  });
}

export function handler() {
  const EMPTY = "";
  const SLASH = "/";
  const DOUBLE_SLASH = "//";
  const HASHTAG = "#";
  const COLON = ":";
  const handlerRoutes: Map<string, HandlerRoute> = new Map();
  const handlerMiddlewares: HandlerMiddleware[] = [];
  const handlerPages: Map<string, {
    url: string;
    host: string;
    path: PathArgument;
    ssr: SSR;
    handler: Handler;
  }> = new Map();

  let routerList: AppMiddleware[] = [];
  let hostname = EMPTY;
  let staticURL: string;
  let isInit = false;

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

  function initStaticPath(sttcPath: string, url: string) {
    const [http, path] = url.split(DOUBLE_SLASH);
    const [host] = path.split(SLASH);
    hostname = `${http}${DOUBLE_SLASH}${host}`;
    staticURL = `${hostname}${sttcPath}`;
  }

  function initHandler(
    path: string,
    middlewares: AppMiddleware[],
    routes: Map<string, Route>,
    pages: Map<string, SSRHandler>,
    req: Request,
  ) {
    routerList = initHandlerMiddlewares(middlewares, req.url);
    if (routerList.length > 0) {
      handleRouterMiddleware(routerList, req.url);
    }
    initHandlerRoutes(routes, req.url);
    initStaticPath(path, req.url);
    initPages(pages, req.url);
    isInit = true;
  }

  function isString(stringResult: unknown) {
    const str = <string> stringResult;
    try {
      return (str.includes != undefined && str.replaceAll != undefined);
    } catch (_error) {
      throw new Error(`Handler return void`);
    }
  }

  function isJSX(element: unknown) {
    const el = <JSX.Element> element;
    return el.props != undefined && el.type != undefined;
  }

  function isHTML(element: unknown) {
    return element instanceof Response;
  }

  function isJSON(element: unknown) {
    // potensial ada bug
    if (element instanceof Promise) return [false, ""];
    let stringify;
    let str = "";
    try {
      str = <string> element;
      stringify = JSON.stringify(str);
      JSON.parse(stringify);
    } catch (_err) {
      return [false, ""];
    }
    return [true, stringify];
  }

  function handleRequest(
    req: Request,
    connInfo: ConnInfo,
    routes: Map<string, Route>,
    middlewares: AppMiddleware[],
    path: string,
    pages: Map<string, SSRHandler>,
  ): Response | Promise<Response> {
    if (!isInit) {
      initHandler(
        path,
        middlewares,
        routes,
        pages,
        req,
      );
    }

    if (handlerMiddlewares.length > 0) {
      const done = processHandlerMiddleware(handlerMiddlewares, req, connInfo);
      if (!done) throw Error("Middleware execution not finished");
    }

    const ssr = handlerPages.get(createPageKey(req));
    if (ssr) return handleJSXPage(ssr, req, connInfo);

    const res = handlerRoutes.get(createMapKey(req));
    if (!res) {
      return handleStaticFile(staticURL, req.url);
    }

    const { length, [length - 1]: handler } = res.handlers;
    if (length > 1) return loopHandlers(res, req, connInfo);
    if (!isHandler(handler)) throw new Error("The argument must be a handler");
    const stringHandler = <StringHandler> <unknown> handler;
    const stringResult = stringHandler(req, connInfo);

    if (isString(stringResult)) {
      return new Response(stringResult);
    }
    if (isHTML(stringResult)) {
      return <Response> <unknown> stringResult;
    }
    if (isJSX(stringResult)) {
      return render(<JSX.Element> <unknown> stringResult);
    }

    const [json, jsonObject] = isJSON(stringResult);
    if (json) {
      const headers = new Headers();
      headers.set("content-type", "application/json");
      return new Response(<string> jsonObject, { headers });
    }

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

    return new Response(STATUS_TEXT.get(Status.InternalServerError), {
      status: Status.InternalServerError,
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
      if (err) throw err;
      done = true;
    });
    return done;
  }

  function createPageKey(req: Request) {
    let result = EMPTY;
    handlerPages.forEach((v) => {
      if (
        req.method && validateURL(v.url, req.url, v.host, v.path)
      ) {
        result = `${req.method}${COLON}${v.url}`;
      }
    });
    return result;
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

  function isQuery(path: string, incoming: string) {
    const str = `${path}${incoming}`;
    return str.charAt(str.length) === "?";
  }

  function isValidPath(path: string, incoming: string[], idx: number) {
    return (path === incoming[idx] ||
      regex(incoming[idx], path)) ||
      isQuery(path, incoming[idx]);
  }

  function regex(incoming: string, path: string) {
    if (path) {
      if (path.charAt(0) === COLON) return true;
      const regex = new RegExp("\\b" + path + "\\b", "g");
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
    if (!req) return {};
    const obj: Record<string, string> = {};
    extractParams(req).forEach((val) => obj[val.name] = val.value);
    return obj;
  }

  function getParam(name: string, req: Request) {
    if (!req) return "";
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

  function initPages(pages: Map<string, SSRHandler>, url: string) {
    const [http, path] = url.split(DOUBLE_SLASH);
    const [host] = path.split(SLASH);
    hostname = `${http}${DOUBLE_SLASH}${host}`;

    if (pages.size > 0) {
      pages.forEach((v, k) => {
        const [method, , kpath] = k.split(HASHTAG);
        const key = `${method}:${hostname}${kpath}`;
        handlerPages.set(key, {
          host: hostname,
          url: `${hostname}${kpath}`,
          path: v.path,
          ssr: v.ssr,
          handler: v.handler,
        });
      });
      pages.clear();
    }
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
    staticPath: string,
    routes: Map<string, Route>,
    middlewares: AppMiddleware[],
    pages: Map<string, SSRHandler>,
  ) {
    return function (
      req: Request,
      connInfo: ConnInfo,
    ): Response | Promise<Response> {
      return handleRequest(
        req,
        connInfo,
        routes,
        middlewares,
        staticPath,
        pages,
      );
    };
  }

  return {
    createHandler,
    getParams,
    getParam,
  };
}
