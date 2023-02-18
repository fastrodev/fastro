// deno-lint-ignore-file no-explicit-any
import { ReactDOMServer } from "./deps.ts";
import { handleJSXPage } from "./page.ts";
import { response } from "./response.ts";
import { handleStaticFile } from "./static.ts";
import {
  ExecHandler,
  HandlerArgument,
  HttpRequest,
  MiddlewareArgument,
  Next,
  Route,
  SSRHandler,
} from "./types.ts";

export function createHandler(
  middlewares: Array<MiddlewareArgument>,
  routes: Array<Route>,
  pages: Array<SSRHandler>,
  _staticFolder: string,
  staticURL: string,
  cache: any,
) {
  return function (request: Request) {
    let handler: HandlerArgument | undefined = undefined;
    if (middlewares.length > 0) {
      handler = handleMiddleware(request, middlewares);
    }

    if (!handler) {
      return handleRoutes(request);
    }

    return handler(transformRequest(request), response(request));
  };

  function handlePages(req: Request, id: string) {
    let page: SSRHandler | undefined = undefined;
    let match: URLPatternResult | null = null;
    const pageId = "page-" + id;
    const matchId = "match-" + pageId;

    if (cache[pageId]) {
      page = cache[pageId] === "non-page" ? undefined : cache[pageId];
      if (cache[matchId]) match = cache[matchId];
    } else {
      const p = pages.find((page) => {
        let pattern: URLPattern | null = new URLPattern({
          pathname: page.path,
        });
        const m = pattern.exec(req.url);
        pattern = null;
        if (m) {
          match = m;
          cache[matchId] = m;
          return (m);
        }
      });
      cache[pageId] = p ? p : "non-page";
      page = p;
    }

    if (!page) {
      return handleStaticFile(req.url, staticURL);
    }

    return handleJSXPage(page, transformRequest(req, match));
  }

  function handleRoutes(req: Request) {
    const id = req.method + "-" + req.url;
    const paramId = "param-" + id;
    let handler: HandlerArgument | undefined = undefined;
    let match: URLPatternResult | null = null;

    if (cache[id]) {
      handler = cache[id];
      if (cache[paramId]) match = cache[paramId];
    } else {
      routes.find((route) => {
        let pattern: URLPattern | null = new URLPattern({
          pathname: route.path,
        });
        const m = pattern.exec(req.url);
        pattern = null;
        if (m) {
          match = m;
          handler = route?.handler;
          return (route.method === req.method);
        }
      });
    }

    if (!handler) return handlePages(req, id);

    cache[id] = handler;
    cache[paramId] = match;
    const res = response(req);
    const next: Next | undefined = undefined;
    const execHandler = <ExecHandler> <unknown> handler;
    const request = transformRequest(req, match);
    const result = execHandler(request, res, next);

    if (isString(result)) {
      return new Response(result);
    }

    if (isResponse(result)) {
      return <Response> <unknown> result;
    }

    if (isJSX(result)) {
      return render(<JSX.Element> <unknown> result);
    }

    const [isJson, object] = isJSON(result);
    if (isJson) {
      const headers = new Headers();
      headers.set("content-type", "application/json");
      return new Response(<string> object, { headers });
    }

    return handler(request, res, next);
  }

  function handleMiddleware(
    req: Request,
    middlewares: Array<MiddlewareArgument>,
  ) {
    let done = false;
    let handler: HandlerArgument | undefined = undefined;
    for (let index = 0; index < middlewares.length; index++) {
      const m = middlewares[index];
      const res = response(req);
      m(transformRequest(req), res, (err) => {
        if (err) throw err;
        done = true;
      });

      if (!done) {
        handler = <HandlerArgument> m;
        break;
      }
    }

    return handler;
  }
}

function isString(stringResult: unknown) {
  const str = <string> stringResult;
  try {
    return (str.includes != undefined && str.replaceAll != undefined);
  } catch {
    throw new Error(`Handler return void`);
  }
}

function isResponse(element: unknown) {
  return element instanceof Response;
}

function isJSON(element: unknown) {
  if (element instanceof Promise) return [false, ""];
  let stringify;
  let str = "";
  try {
    str = <string> element;
    stringify = JSON.stringify(str);
    JSON.parse(stringify);
  } catch {
    return [false, ""];
  }
  return [true, stringify];
}

export function isJSX(element: unknown) {
  const el = <JSX.Element> element;
  return el.props != undefined && el.type != undefined;
}

function render(element: JSX.Element) {
  const component = ReactDOMServer.renderToString(element);
  return new Response(component, {
    headers: {
      "content-type": "text/html",
    },
  });
}

export function transformRequest(
  request: Request,
  match?: URLPatternResult | null,
) {
  const req = <HttpRequest> request;
  if (!match) {
    req.match = null;
    return req;
  }
  req.match = match;
  return req;
}
