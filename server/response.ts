import { RequestResponse, SSR } from "./types.ts";
import { Cookie, deleteCookie, setCookie } from "./deps.ts";

export function response(): RequestResponse {
  let headers = new Headers();
  let responseAuthorization: string;
  let responseStatus = 200;
  let contentType = "text/plain;charset=UTF-8";
  let cookie: Cookie;
  let ssr: SSR;

  function createResponse(str: BodyInit | null | undefined) {
    if (responseAuthorization) {
      headers.set("Authorization", responseAuthorization);
    }
    if (cookie) setCookie(headers, cookie);
    headers.set("Content-Type", contentType);
    return new Response(str, {
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
      return ssr;
    },
  };

  return instance;
}
