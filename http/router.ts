import {
  ALL,
  DELETE,
  GET,
  HandlerArgument,
  HEAD,
  LOCALHOST,
  OPTIONS,
  PATCH,
  PathArgument,
  POST,
  PUT,
  Route,
  Router,
  SPLITTER,
} from "$fastro/http/types.ts";

export function router(): Router {
  const routes: Map<string, Route> = new Map();
  function createRoute(
    method: string,
    path: PathArgument,
    handler: HandlerArgument,
  ) {
    const routeKey = `${method}${SPLITTER}${LOCALHOST}${SPLITTER}${path}`;
    routes.set(routeKey, { method, path, handler });
    return instance;
  }
  const instance = {
    routes,
    get: (path: PathArgument, handler: HandlerArgument) => {
      return createRoute(GET, path, handler);
    },
    post: (path: PathArgument, handler: HandlerArgument) => {
      return createRoute(POST, path, handler);
    },
    put: (path: PathArgument, handler: HandlerArgument) => {
      return createRoute(PUT, path, handler);
    },
    delete: (path: PathArgument, handler: HandlerArgument) => {
      return createRoute(DELETE, path, handler);
    },
    patch: (path: PathArgument, handler: HandlerArgument) => {
      return createRoute(PATCH, path, handler);
    },
    head: (path: PathArgument, handler: HandlerArgument) => {
      return createRoute(HEAD, path, handler);
    },
    options: (path: PathArgument, handler: HandlerArgument) => {
      return createRoute(OPTIONS, path, handler);
    },
    use: (path: PathArgument, handler: HandlerArgument) => {
      return createRoute(ALL, path, handler);
    },
  };

  return instance;
}
