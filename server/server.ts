import {
  DELETE,
  GET,
  OPTIONS,
  PATCH,
  POST,
  PUT,
} from "$fastro/server/constant.ts";
import { ServeInit, Server } from "$fastro/server/deps.ts";
import { createHandler } from "$fastro/server/handler.ts";
import {
  Fastro,
  HandlerArgument,
  Route,
  StartOptions,
} from "$fastro/server/types.ts";

export function fastro(startOptions?: StartOptions): Fastro {
  const routes: Array<Route> = [];
  const ac = new AbortController();
  let server: Server;

  const app = {
    serve: (serveOptions: ServeInit) => {
      if (startOptions && startOptions.flash) {
        return Deno.serve({
          hostname: serveOptions?.hostname,
          handler: createHandler(routes),
          signal: ac.signal,
          port: serveOptions?.port,
          onListen: serveOptions?.onListen,
          onError: serveOptions?.onError,
        });
      }

      server = new Server({
        handler: createHandler(routes),
        onError: serveOptions?.onError,
      });
      const port = serveOptions?.port || 9000;
      const hostname = serveOptions?.hostname || "127.0.0.1";
      const listener = Deno.listen({ port, hostname });
      console.info(`Listening on http://${hostname}:${port}/`);
      return server.serve(listener);
    },
    close: () => {
      if (startOptions && startOptions.flash) {
        return ac.abort();
      }
      return server.close();
    },
    get: (path: string, handler: HandlerArgument) => {
      routes.push({ method: GET, path, handler });
      return app;
    },
    post: (path: string, handler: HandlerArgument) => {
      routes.push({ method: POST, path, handler });
      return app;
    },
    put: (path: string, handler: HandlerArgument) => {
      routes.push({ method: PUT, path, handler });
      return app;
    },
    delete: (path: string, handler: HandlerArgument) => {
      routes.push({ method: DELETE, path, handler });
      return app;
    },
    patch: (path: string, handler: HandlerArgument) => {
      routes.push({ method: PATCH, path, handler });
      return app;
    },
    options: (path: string, handler: HandlerArgument) => {
      routes.push({ method: OPTIONS, path, handler });
      return app;
    },
  };
  return app;
}
