import { HandlerArgument, PathArgument, Route, Router } from "./types.ts";

export function router(): Router {
  const routes: Map<string, Route> = new Map();
  const LOCALHOST = "localhost";

  const instance = {
    routes,
    get: (path: PathArgument, ...handlers: HandlerArgument[]) => {
      return createRoute("GET", path, handlers);
    },
    post: (path: PathArgument, ...handlers: HandlerArgument[]) => {
      return createRoute("POST", path, handlers);
    },
    put: (path: PathArgument, ...handlers: HandlerArgument[]) => {
      return createRoute("PUT", path, handlers);
    },
    delete: (path: PathArgument, ...handlers: HandlerArgument[]) => {
      return createRoute("DELETE", path, handlers);
    },
    patch: (path: PathArgument, ...handlers: HandlerArgument[]) => {
      return createRoute("PATCH", path, handlers);
    },
    head: (path: PathArgument, ...handlers: HandlerArgument[]) => {
      return createRoute("HEAD", path, handlers);
    },
    options: (path: PathArgument, ...handlers: HandlerArgument[]) => {
      return createRoute("OPTIONS", path, handlers);
    },
  };

  function createRoute(
    method: string,
    path: PathArgument,
    handlers: HandlerArgument[],
  ) {
    routes.set(`${method}#${LOCALHOST}#${path}`, { method, path, handlers });
    return instance;
  }

  return instance;
}
