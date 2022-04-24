import { AppMiddleware, MiddlewareArgument, Router } from "./types.ts"

export function middleware() {
  const middlewares: AppMiddleware[] = []

  function isRegex(regexPath: MiddlewareArgument) {
    return regexPath instanceof RegExp
  }

  function isString(path: MiddlewareArgument) {
    return typeof path === "string"
  }

  function isRouter(element: Router) {
    return element.routes !== undefined
  }

  function isContainRouter(array: MiddlewareArgument[]) {
    for (let index = 0; index < array.length; index++) {
      const element = array[index]
      const yes = isRouter(<Router>element)
      if (yes) return true
    }
    return false
  }

  function useMiddleware(...array: MiddlewareArgument[]) {
    const [first, ...rest] = array
    let path: RegExp | string = "/.*"
    let appMiddlewares = rest
    let type = ""

    if (isRegex(first)) {
      path = <RegExp>first
    } else if (isString(first)) {
      path = <string>first
    } else {
      appMiddlewares = array
    }

    if (isContainRouter(rest)) {
      type = "router"
    }

    middlewares.push({ path, middlewares: appMiddlewares, type })
  }

  return {
    useMiddleware,
    middlewares,
  }
}
