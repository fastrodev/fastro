import { serve, ServeInit } from "./deps.ts";
import { handler } from "./handler.ts";
import { router } from "./router.ts";
import { HandlerArgument, PathArgument } from "./types.ts";

interface Application {
  serve(options?: ServeInit): Promise<void>;
  get(path: PathArgument, ...handlers: HandlerArgument[]): Application;
  post(path: PathArgument, ...handlers: HandlerArgument[]): Application;
  put(path: PathArgument, ...handlers: HandlerArgument[]): Application;
  delete(path: PathArgument, ...handlers: HandlerArgument[]): Application;
  head(path: PathArgument, ...handlers: HandlerArgument[]): Application;
  options(path: PathArgument, ...handlers: HandlerArgument[]): Application;
  patch(path: PathArgument, ...handlers: HandlerArgument[]): Application;
}

const appHandler = handler();

export const { getParams, getParam } = appHandler;

export function application(): Application {
  const appRouter = router();
  const app = {
    serve: (options: ServeInit = {}) => {
      return serve(appHandler.createHandler(appRouter.routes), options);
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
  };

  return app;
}
