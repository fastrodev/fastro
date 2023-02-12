import { Cookie, deleteCookie, ReactDOMServer, setCookie } from "./deps.ts";
import { isJSX } from "./handler.ts";
import { HttpResponse, SSR } from "./types.ts";

type BodyInitResponse = BodyInit | null | undefined;

export function response(req: Request): HttpResponse {
  let headers = new Headers();
  let responseAuthorization: string;
  let responseStatus = 200;
  let cookie: Cookie;
  let contentType = "text/plain;charset=UTF-8";
  let requestInstance: Request;
  let ssr: SSR;

  if (req) requestInstance = req;

  function createResponse(
    str: BodyInitResponse | JSX.Element,
  ) {
    if (responseAuthorization) {
      headers.set("Authorization", responseAuthorization);
    }
    if (cookie) setCookie(headers, cookie);
    headers.set("Content-Type", contentType);

    if (isJSX(str)) {
      const component = ReactDOMServer.renderToString(<JSX.Element> str);

      return new Response(component, {
        status: responseStatus,
        headers,
      });
    }

    return new Response(<BodyInitResponse> str, {
      status: responseStatus,
      headers,
    });
  }

  const instance = {
    send: (object: unknown) => {
      const str = <string> object;
      return createResponse(str);
    },
    json: (object: unknown) => {
      try {
        const str = JSON.stringify(object);
        contentType = "application/json; charset=UTF-8";
        return createResponse(str);
      } catch (error) {
        throw new Error(`jsonError: ${error.toString()}`);
      }
    },
    html: (html: string) => {
      contentType = "text/html; charset=UTF-8";
      return createResponse(html);
    },
    jsx: (element: JSX.Element) => {
      contentType = "text/html; charset=UTF-8";
      return createResponse(element);
    },
    status: (status: number) => {
      responseStatus = status;
      return instance;
    },
    contentType: (type: string) => {
      contentType = type;
      return instance;
    },
    authorization: (authorization: string) => {
      responseAuthorization = authorization;
      return instance;
    },
    headers: (customHeaders: Headers) => {
      headers = customHeaders;
      return instance;
    },
    setCookie: (appCookie: Cookie) => {
      cookie = appCookie;
      return instance;
    },
    deleteCookie: (
      name: string,
      attributes?: {
        path?: string | undefined;
        domain?: string | undefined;
      } | undefined,
    ) => {
      deleteCookie(headers, name, attributes);
      return instance;
    },
    ssr: (ssrInstance: SSR) => {
      ssr = ssrInstance;
      ssr._setRequest(requestInstance);
      return ssr;
    },
  };

  return instance;
}
