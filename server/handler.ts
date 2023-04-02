// deno-lint-ignore-file no-explicit-any
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
} from "../types.d.ts";
import { CACHE, NONPAGE } from "./constant.ts";
import { ReactDOMServer } from "./deps.ts";
import { handleJSXPage } from "./page.ts";
import { response } from "./response.ts";
import { handleStaticFile } from "./static.ts";

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
    if (middlewares.length > 0) {
      const h = handleMiddleware(r, middlewares);
      if (h) {
        return (<RequestHandler> h)(
          transformRequest(r, container, null),
          response(r),
        );
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
        const m = patterns[page.path].test(r.url);
        if (m) {
          match = patterns[page.path].exec(r.url);
          cache[matchId] = match;
          return (m);
        }
      });
      cache[pageId] = p ? p : NONPAGE;
      page = p;
    }

    if (!page) {
      return handleStaticFile(r.url, staticURL, maxAge, cache);
    }

    return handleJSXPage(
      page,
      transformRequest(r, container, match),
      container,
    );
  }

  function getHandler(r: Request, routes: Route[], id: string) {
    const paramId = `param-${id}`;
    let handler: HandlerArgument | undefined | null = undefined;
    let match: URLPatternResult | null = null;

    if (cache[id] && cache[paramId]) {
      return {
        handler: cache[id],
        match: cache[paramId],
      };
    }

    for (let index = 0; index < routes.length; index++) {
      const route = routes[index];
      const m = patterns[route.path].exec(r.url);
      if ((route.method === r.method) && m) {
        handler = route?.handler;
        match = m;
        cache[id] = handler;
        cache[paramId] = match;
        break;
      }
    }

    return { handler, match };
  }

  function handleRoutes(r: Request) {
    const routeId = `${r.method}-${r.url}`;
    const { handler, match } = getHandler(r, routes, routeId);
    if (!handler) return handlePages(r, routeId);
    if (routeMiddlewares.length > 0) {
      const h = handleRouteMiddleware(r, routeMiddlewares);
      if (h) {
        return (<RequestHandler> h)(
          transformRequest(r, container, match),
          response(r),
        );
      }
    }

    const execHandler = <ExecHandler> <unknown> handler;
    const result = execHandler(
      transformRequest(r, container, match),
      response(r),
    );

    return handleResult(result);
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
      let match = false;
      const m = routeMiddlewares[index];
      const mid = r.method + m.path + r.url;

      match = cache[mid] ? cache[mid] : patterns[m.path].test(r.url);
      if (match && (m.method === r.method)) {
        cache[mid] = match;
        const res = response(r);
        m.handler(transformRequest(r, container), res, (error) => {
          done = true;
          if (error) throw error;
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
      m(transformRequest(r, container), res, (error) => {
        done = true;
        if (error) throw error;
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
  const stringify = JSON.stringify(res);
  JSON.parse(stringify);
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

function iterableToRecord(
  params: URLSearchParams,
): Record<string, string> {
  const record: Record<string, string> = {};
  params.forEach((v, k) => (record[k] = v));
  return record;
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
  req.params = (name?: string) => {
    if (name) return match.pathname.groups[name];
    return match.pathname.groups;
  };
  req.query = (name?: string) => {
    if (!name) {
      return iterableToRecord(new URL(req.url).searchParams);
    }
    return new URL(req.url).searchParams.get(name);
  };
  return req;
}
