// deno-lint-ignore-file no-explicit-any
import { ReactDOMServer } from "./deps.ts";
import { handleJSXPage } from "./page.ts";
import { response } from "./response.ts";
import { handleStaticFile } from "./static.ts";
import {
  ExecHandler,
  HandlerArgument,
  MiddlewareArgument,
  Next,
  Route,
  SSRHandler,
} from "./types.ts";

export function createHandler(
  middlewares: Array<MiddlewareArgument>,
  routes: Array<Route>,
  pages: Array<SSRHandler>,
  staticUrl: string,
  staticFolder: string,
  cache: any,
) {
  return function (req: Request) {
    let handler: HandlerArgument | undefined = undefined;
    if (middlewares.length > 0) {
      handler = handleMiddleware(req, middlewares);
    }

    if (!handler) {
      return handleRoutes(req);
    }

    return handler(req, response(req));
  };

  function handlePages(req: Request, id: string) {
    let page: SSRHandler | undefined = undefined;

    const pageId = "page-" + id;
    if (cache[pageId]) {
      page = cache[pageId] === "non-page" ? undefined : cache[pageId];
    } else {
      const p = pages.find((page) => {
        let pattern: URLPattern | null = new URLPattern({
          pathname: page.path,
        });
        const match = pattern.exec(req.url);
        pattern = null;
        return (match);
      });
      cache[pageId] = p ? p : "non-page";
      page = p;
    }

    if (!page) {
      return handleStaticFile(staticUrl, req.url, staticFolder);
    }

    return handleJSXPage(page, req);
  }

  function handleRoutes(req: Request) {
    const id = req.method + "-" + req.url;
    let handler: HandlerArgument | undefined = undefined;

    if (cache[id]) handler = cache[id];
    else {
      const route = routes.find((route) => {
        let pattern: URLPattern | null = new URLPattern({
          pathname: route.path,
        });
        const match = pattern.exec(req.url);
        pattern = null;
        return (match && (route.method === req.method));
      });

      handler = route?.handler;
    }

    if (!handler) {
      return handlePages(req, id);
    }

    cache[id] = handler;
    const res = response(req);
    const next: Next | undefined = undefined;
    const execHandler = <ExecHandler> <unknown> handler;
    const result = execHandler(req, res, next);

    if (isString(result)) {
      return new Response(result);
    }

    if (isHTML(result)) {
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

    return handler(req, res, next);
  }

  function handleMiddleware(
    request: Request,
    middlewares: Array<MiddlewareArgument>,
  ) {
    let done = false;
    let handler: HandlerArgument | undefined = undefined;
    for (let index = 0; index < middlewares.length; index++) {
      const m = middlewares[index];
      const req = transformRequest(request);
      const res = response(request);
      m(req, res, (err) => {
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
  } catch (_error) {
    throw new Error(`Handler return void`);
  }
}

function isHTML(element: unknown) {
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
  } catch (_err) {
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

function transformRequest(request: Request) {
  return request;
}
