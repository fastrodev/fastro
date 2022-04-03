import { ServeInit, Server } from "./deps.ts";
import { handler } from "./handler.ts";
import { middleware } from "./middleware.ts";
import { router } from "./router.ts";
import {
  Deps,
  HandlerArgument,
  MiddlewareArgument,
  PathArgument,
} from "./types.ts";

interface Application {
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
export const deps = new Map<string, unknown>();
export function application(dependencies?: Deps): Application {
  const appRouter = router();
  const appMiddleware = middleware();
  const appDeps = dependencies ?? deps;
  let server: Server;
  const app = {
    deps: appDeps,
    getDeps: (key: string) => {
      return appDeps.get(key);
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
      appMiddleware.useMiddleware(...middlewares);
      return app;
    },
  };

  return app;
}
