import {
  ALL,
  COLON,
  DEFAULT_HOST,
  DEFAULT_PORT,
  Handler,
  HandlerArgument,
  NOT_FOUND_STATUS,
  NOT_FOUND_TEXT,
  Route,
  SPLITTER,
  StrHandler,
} from "$fastro/http/types.ts";

function createKey(method: string, url: string) {
  return `${method}${SPLITTER}${url}`;
}

export function handler(
  req: Request,
  hostName = DEFAULT_HOST,
  port = DEFAULT_PORT,
  routes: Map<string, Route>,
): Response | Promise<Response> {
  let r = routes.get(createKey(req.method, req.url));
  if (!r) r = routes.get(createKey(ALL, req.url));
  if (!r) {
    const baseURL = `http://${hostName}:${port}`;
    const url = parseURL(baseURL, req.url, req.method, routes);
    r = routes.get(createKey(req.method, url));
  }
  if (!r) {
    return new Response(NOT_FOUND_TEXT, {
      status: NOT_FOUND_STATUS,
      statusText: NOT_FOUND_TEXT,
    });
  }
  return handleRequest(req, r.handler);
}

function handleRequest(req: Request, routeHandler: HandlerArgument) {
  const strHandler = <StrHandler> <unknown> routeHandler;
  const res = strHandler(req);
  if (isString(res)) return new Response(res);
  const handler = <Handler> routeHandler;
  return handler(req);
}

function isString(stringResult: unknown) {
  const str = <string> stringResult;
  return str.toLocaleLowerCase != undefined;
}

export function parseURL(
  splitter: string,
  url: string,
  method: string,
  routes: Map<string, Route>,
) {
  let result = SPLITTER;
  routes.forEach((_val, key) => {
    const [routeMethod, routeUrl] = key.split(SPLITTER);
    if (method === routeMethod && validateURL(splitter, url, routeUrl)) {
      result = routeUrl;
    }
  });
  return result;
}

function validateURL(splitter: string, url: string, routeUrl: string) {
  // console.log(url);
  // console.log(routeUrl);
  const [, urlPath] = url.split(splitter);
  const [, routeUrlPath] = routeUrl.split(splitter);
  const incoming = urlPath.split("/");
  const route = routeUrlPath.split("/");
  if (incoming.length !== route.length) return false;
  return parsePath(route, incoming);
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
  return (path === incoming[idx] ||
    regex(incoming[idx], path)) ||
    isQuery(path, incoming[idx]);
}

function isQuery(path: string, incoming: string) {
  const str = `${path}${incoming}`;
  return str.charAt(str.length) === "?";
}

function regex(incoming: string, path: string) {
  if (!path) return false;
  if (path.charAt(0) === COLON) return true;
  const regex = new RegExp("\\b" + path + "\\b", "g");
  return regex.test(incoming);
}
