import { ReactDOMServer, Status, STATUS_TEXT } from "$fastro/server/deps.ts";
import { Route, StringHandler } from "$fastro/server/types.ts";

export function createHandler(routes: Array<Route>) {
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

  function render(element: JSX.Element) {
    const component = ReactDOMServer.renderToString(element);
    return new Response(component, {
      headers: {
        "content-type": "text/html",
      },
    });
  }

  return function (req: Request) {
    for (let index = 0; index < routes.length; index++) {
      const route = routes[index];
      let pattern: URLPattern | null = new URLPattern({
        pathname: route.path,
      });
      const match = pattern.exec(req.url);
      pattern = null;
      if (match && (route.method === req.method)) {
        const stringHandler = <StringHandler> <unknown> route.handler;
        const result = stringHandler(req);

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

        return route.handler(req, () => {});
      }
    }

    return new Response(STATUS_TEXT[Status.NotFound], {
      status: Status.NotFound,
    });
  };
}
