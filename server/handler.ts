import { ReactDOMServer } from "$fastro/server/deps.ts";
import { response } from "$fastro/server/response.ts";
import { handleStaticFile } from "$fastro/server/static.ts";
import {
  HandlerArgument,
  Next,
  Route,
  SSRHandler,
  StringHandler,
} from "$fastro/server/types.ts";
import { handleJSXPage } from "./page.ts";

export function createHandler(
  routes: Array<Route>,
  staticUrl: string,
  staticFolder: string,
  // deno-lint-ignore no-explicit-any
  cache: any,
  pages: Array<SSRHandler>,
) {
  return function (req: Request) {
    const id = req.method + "-" + req.url;
    let handler: HandlerArgument | undefined = undefined;
    let page: SSRHandler | undefined = undefined;

    if (pages.length > 0) {
      const pageId = "page-" + id;
      if (cache[pageId]) {
        page = cache[pageId];
      } else {
        const p = pages.find((page) => {
          let pattern: URLPattern | null = new URLPattern({
            pathname: page.path,
          });
          const match = pattern.exec(req.url);
          pattern = null;
          return (match);
        });
        cache[pageId] = p;
        page = p;
      }

      if (!page) {
        return handleStaticFile(staticUrl, req.url, staticFolder);
      }

      return handleJSXPage(page, req);
    }

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
      return handleStaticFile(staticUrl, req.url, staticFolder);
    }

    cache[id] = handler;
    const res = response(req);
    const next: Next | undefined = undefined;
    const stringHandler = <StringHandler> <unknown> handler;
    const result = stringHandler(req, res, next);

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
  };
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

function isJSX(element: unknown) {
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
