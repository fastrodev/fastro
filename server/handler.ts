// deno-lint-ignore-file no-explicit-any
import { CACHE, NONPAGE } from "./constant.ts";
import { ReactDOMServer } from "./deps.ts";
import { handleJSXPage } from "./page.ts";
import { response } from "./response.ts";
import { handleStaticFile } from "./static.ts";
import {
  Container,
  ExecHandler,
  HandlerArgument,
  HttpRequest,
  MiddlewareArgument,
  RequestHandler,
  Route,
  RouteMidleware,
  Row,
  SetOptions,
  SSRHandler,
} from "./types.ts";

export function createHandler(
  middlewares: Array<MiddlewareArgument>,
  routeMiddlewares: Array<RouteMidleware>,
  routes: Array<Route>,
  patterns: Record<string, URLPattern>,
  pages: Array<SSRHandler>,
  staticURL: string,
  container: Container,
  maxAge: number,
) {
  let cache: Row = {};
  return function (r: Request) {
    cache = <Row> container.get(CACHE);
    let handler: HandlerArgument | undefined = undefined;
    if (middlewares.length > 0) {
      handler = handleMiddleware(r, middlewares);
      if (handler) {
        const h = <RequestHandler> handler;
        return h(transformRequest(r, container, null), response(r), undefined);
      }
    }
    return handleRoutes(r);
  };

  function handlePages(r: Request, id: string) {
    let page: SSRHandler | undefined | null = undefined;
    let match: URLPatternResult | null = null;
    const pageId = `page-${id}`;
    const matchId = `match-${pageId}`;

    if (cache[pageId]) {
      page = cache[pageId] === NONPAGE ? undefined : cache[pageId];
      if (cache[matchId]) match = cache[matchId];
    } else {
      const p = pages.find((page) => {
        const m = patterns[page.path].exec(r.url);
        if (m) {
          match = m;
          cache[matchId] = m;
          return (m);
        }
      });
      cache[pageId] = p ? p : NONPAGE;
      page = p;
    }

    if (!page) {
      return handleStaticFile(r.url, staticURL, maxAge);
    }

    return handleJSXPage(
      page,
      transformRequest(r, container, match),
      container,
    );
  }

  function handleRoutes(r: Request) {
    const id = `${r.method}-${r.url}`;
    const paramId = `param-${id}`;
    let handler: HandlerArgument | undefined | null = undefined;
    let match: URLPatternResult | null = null;

    if (cache[id]) {
      handler = cache[id];
      if (cache[paramId]) match = cache[paramId];
    } else {
      for (let index = 0; index < routes.length; index++) {
        const route = routes[index];
        const m = patterns[route.path].exec(r.url);
        if (m && (route.method === r.method)) {
          handler = route?.handler;
          match = m;
          cache[id] = handler;
          cache[paramId] = match;
        }
      }
    }

    if (!handler) return handlePages(r, id);

    const execHandler = <ExecHandler> <unknown> handler;
    if (routeMiddlewares.length > 0) {
      handler = handleRouteMiddleware(r, routeMiddlewares);
      if (handler) {
        const h = <RequestHandler> handler;
        return h(transformRequest(r, container, null), response(r), undefined);
      }
    }

    return handleResult(execHandler(
      transformRequest(r, container, match),
      response(r),
      undefined,
    ));
  }

  function handleResult(result: any) {
    if (isString(result)) return new Response(result);

    if (isResponse(result)) return <Response> <unknown> result;

    if (isJSX(result)) return render(<JSX.Element> <unknown> result);

    const [isJson, object] = isJSON(result);
    if (isJson) {
      const headers = new Headers();
      headers.set("content-type", "application/json");
      return new Response(<string> object, { headers });
    }

    return new Response(result);
  }

  function handleRouteMiddleware(
    r: Request,
    routeMiddlewares: Array<RouteMidleware>,
  ) {
    let handler: HandlerArgument | undefined = undefined;

    for (let index = 0; index < routeMiddlewares.length; index++) {
      let done = false;
      const m = routeMiddlewares[index];
      const match = patterns[m.path].exec(r.url);
      if (match && (m.method === r.method)) {
        const res = response(r);
        m.handler(transformRequest(r, container), res, (err) => {
          if (err) throw err;
          done = true;
        });

        if (!done) {
          handler = <HandlerArgument> m.handler;
          break;
        }
      }
    }
    return handler;
  }

  function handleMiddleware(
    r: Request,
    middlewares: Array<MiddlewareArgument>,
  ) {
    let handler: HandlerArgument | undefined = undefined;
    for (let index = 0; index < middlewares.length; index++) {
      let done = false;
      const m = middlewares[index];
      const res = response(r);
      m(transformRequest(r, container), res, (err) => {
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

function isString(res: any) {
  return typeof res === "string";
}

function isResponse(res: any) {
  return res instanceof Response;
}

function isJSON(res: any) {
  if (res instanceof Promise) return [false, ""];
  let stringify;
  try {
    stringify = JSON.stringify(res);
    JSON.parse(stringify);
  } catch {
    return [false, ""];
  }
  return [true, stringify];
}

export function isJSX(res: any) {
  const el = <JSX.Element> res;
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
  r: Request,
  container: Container,
  match?: URLPatternResult | null,
) {
  const req = <HttpRequest> r;
  if (!match) {
    req.match = null;
    return req;
  }
  req.container = () => container;
  req.match = match;
  req.get = <T>(key: string) => {
    return <T> container.get(key);
  };
  req.set = <T>(key: string, value: T, options?: SetOptions) => {
    return container.set(key, value, options);
  };
  req.delete = (key: string) => {
    return container.delete(key);
  };
  return req;
}
