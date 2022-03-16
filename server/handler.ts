import { Middleware, Route } from "./types.ts"
import { Handler, ConnInfo } from "./deps.ts"

const NOT_FOUND_STRING = 'URL not found'
const NOT_FOUND_CODE = 404
const UNDEFINED_MIDDLEWARE = 'Undefined middleware'

const routerMap: Map<string, Route> = new Map()

function initReouterMap(
  map: Map<string, Route>,
  url: string) {
  const [http, path] = url.split('//')
  const [host] = path.split('/')
  const hostname = `${http}//${host}`
  map.forEach((v, k) => {
    const [method, , kpath] = k.split('#')
    const key = `${method}:${hostname}${kpath}`
    routerMap.set(key, v)
  })
  map.clear()
}

export function createHandler(map: Map<string, Route>) {
  return function (
    req: Request, connInfo: ConnInfo
  ): Response | Promise<Response> {
    return handleRequest(req, connInfo, map)
  }
}

function handleRequest(
  req: Request,
  connInfo: ConnInfo,
  map: Map<string, Route>,
): Response | Promise<Response> {

  if (routerMap.size < 1) {
    initReouterMap(map, req.url)
  }

  const route = routerMap.get(createMapKey(req))
  if (!route) return new Response(NOT_FOUND_STRING, { status: NOT_FOUND_CODE })
  if (!route?.handler) {
    const handler: Handler = <Handler>route?.middleware
    return handler(req, connInfo)
  }

  const done = handleMiddleware(req, connInfo, route?.middleware)
  if (done) {
    return route?.handler(req, connInfo)
  }

  return new Response(NOT_FOUND_STRING, { status: NOT_FOUND_CODE })
}

const handleMiddleware = (req: Request, connInfo: ConnInfo, middleware?: Middleware) => {
  if (!middleware) {
    throw new Error(UNDEFINED_MIDDLEWARE)
  }
  let done = false
  middleware(req, connInfo, (err) => {
    if (err) {
      throw err
    }
    done = true
  })
  return done
}

function createMapKey(req: Request): string {
  return `${req.method}:${req.url}`
}
