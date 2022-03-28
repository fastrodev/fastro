import { AppMiddleware, MiddlewareArgument } from "./types.ts";

export function middleware() {
  const middlewares: AppMiddleware[] = [];

  function isRegex(regexPath: MiddlewareArgument) {
    return regexPath instanceof RegExp;
  }

  function isString(path: MiddlewareArgument) {
    return typeof path === "string";
  }

  function useMiddleware(...array: MiddlewareArgument[]) {
    const [first, ...rest] = array;
    let path: RegExp | string = "*";
    let appMiddlewares = rest;

    if (isRegex(first)) {
      path = <RegExp> first;
    } else if (isString(first)) {
      path = <string> first;
    } else {
      appMiddlewares = array;
    }

    middlewares.push({ path, middlewares: appMiddlewares });
  }

  return {
    useMiddleware,
    middlewares,
  };
}
