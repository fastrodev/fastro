import { Middleware, Route } from "./types.ts"
import { Handler, ConnInfo } from "./deps.ts"

const NOT_FOUND_STRING = 'URL not found'
const NOT_FOUND_CODE = 404
const UNDEFINED_MIDDLEWARE = 'Undefined middleware'

export interface FinalRoute {
  method: string
  path: string
  url: string
  host: string
  middleware: Handler | Middleware
  handler: Handler
}

const routerMap: Map<string, FinalRoute> = new Map()

function initReouterMap(
  map: Map<string, Route>,
  url: string) {
  const [http, path] = url.split('//')
  const [host] = path.split('/')
  const hostname = `${http}//${host}`
  map.forEach((v, k) => {
    const [method, , kpath] = k.split('#')
    const key = `${method}:${hostname}${kpath}`
    const route = {
      path: v.path,
      method: v.method,
      handler: v.handler,
      middleware: v.middleware,
      url: `${hostname}${kpath}`,
      host: hostname
    }
    routerMap.set(key, route)
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

  const k = createMapKey(req)
  console.log('key', k)
  const route = routerMap.get(k)
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
  let result = ''
  routerMap.forEach((v) => {
    if (v.method === req.method && validate(v.url, req.url, v.host)) {
      result = `${req.method}:${v.url}`
    }
  })
  return result
}

function validate(routeURL: string, incomingURL: string, host: string) {
  const routePath = routeURL.replace(host, '')
  const incomingPath = incomingURL.replace(host, '')
  const r = routePath.split('/')
  const i = incomingPath.split('/')
  if (r.length != i.length) return false
  return parsePath(r, i)
}

function isAllTrue(v: boolean[]) {
  v.forEach((v) => {

  })
}

function parsePath(route: string[], incoming: string[]) {
  let result = false
  route.shift()
  incoming.shift()
  const res = []
  route.forEach((path, idx) => {
    if (path === incoming[idx]
      || regex(incoming[idx], path)
    ) {
      console.log('regex')
      result = false
    }
  })

  // console.log(result)
  return result
}

function regex(incoming: string, path: string) {
  // console.log('incoming', incoming)
  // console.log('path', path)
  // console.log('path.charAt(0)', path.charAt(0))
  // console.log('===')
  // if (path.charAt(0) === ':') {
  //   return true
  // }

  // const c = path.charAt(0) !== ':'
  return true
}

// function getPattern(txt: string) {
//   let str = ''
//   const i = txt.indexOf('(')
//   if (i >= 0) {
//     const j = txt.indexOf(')')
//     if (j >= 0) {
//       str = txt.substring(i, j)
//     }
//   }
//   return str
// }
