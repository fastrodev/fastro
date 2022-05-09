import { ServeInit, Server } from "./deps.ts";
import { handler } from "./handler.ts";
import { middleware } from "./middleware.ts";
import { router } from "./router.ts";
import { dependency } from "./container.ts";
import {
  Dependency,
  HandlerArgument,
  MiddlewareArgument,
  PathArgument,
  SSR,
} from "./types.ts";

interface Application {
  static(path: string, options?: unknown): Application;
  getDeps(key: string): unknown;
  serve(options?: ServeInit): Promise<void>;
  get(path: PathArgument, ...handlers: HandlerArgument[]): Application;
  post(path: PathArgument, ...handlers: HandlerArgument[]): Application;
  put(path: PathArgument, ...handlers: HandlerArgument[]): Application;
  delete(path: PathArgument, ...handlers: HandlerArgument[]): Application;
  head(path: PathArgument, ...handlers: HandlerArgument[]): Application;
  options(path: PathArgument, ...handlers: HandlerArgument[]): Application;
  patch(path: PathArgument, ...handlers: HandlerArgument[]): Application;
  use(...middlewares: MiddlewareArgument[]): Application;
  close(): void;
}

const appHandler = handler();

export const { getParams, getParam } = appHandler;

export function application(ssr?: SSR): Application {
  const appRouter = router();
  const appMiddleware = middleware();
  let appDeps: Dependency = dependency();
  let server: Server;
  let staticDirPath: string;

  if (ssr) ssr.createBundle();

  function containDeps(array: MiddlewareArgument[]) {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (isDeps(element)) {
        return true;
      }
    }
    return false;
  }

  function isDeps(first: MiddlewareArgument) {
    const deps = <Dependency> first;
    return deps.deps !== undefined;
  }

  const app = {
    static: (path: string) => {
      staticDirPath = path;
      return app;
    },
    deps: appDeps.deps,
    getDeps: (key: string) => {
      return appDeps.get(key);
    },
    setDeps: (key: string, val: unknown) => {
      appDeps.set(key, val);
      return app;
    },
    close: () => {
      return server.close();
    },
    serve: (options: ServeInit = {}) => {
      server = new Server({
        onError: options.onError,
        hostname: options.hostname,
        port: options.port,
        handler: appHandler.createHandler(
          staticDirPath,
          appRouter.routes,
          appMiddleware.middlewares,
        ),
      });
      const port = options.port ?? 8000;
      const listener = Deno.listen({ port });
      return server.serve(listener);
    },
    get: (path: PathArgument, ...handlers: HandlerArgument[]) => {
      appRouter.get(path, ...handlers);
      return app;
    },
    post: (path: PathArgument, ...handlers: HandlerArgument[]) => {
      appRouter.post(path, ...handlers);
      return app;
    },
    put: (path: PathArgument, ...handlers: HandlerArgument[]) => {
      appRouter.put(path, ...handlers);
      return app;
    },
    delete: (path: PathArgument, ...handlers: HandlerArgument[]) => {
      appRouter.delete(path, ...handlers);
      return app;
    },
    head: (path: PathArgument, ...handlers: HandlerArgument[]) => {
      appRouter.head(path, ...handlers);
      return app;
    },
    patch: (path: PathArgument, ...handlers: HandlerArgument[]) => {
      appRouter.patch(path, ...handlers);
      return app;
    },
    options: (path: PathArgument, ...handlers: HandlerArgument[]) => {
      appRouter.options(path, ...handlers);
      return app;
    },
    use: (...middlewares: MiddlewareArgument[]) => {
      const [first, ...rest] = middlewares;
      if (isDeps(first)) {
        appDeps = <Dependency> first;
        if (containDeps(rest)) {
          throw Error("Dependency only used at first argument");
        }
      } else {
        appMiddleware.useMiddleware(...middlewares);
      }
      return app;
    },
  };

  return app;
}
