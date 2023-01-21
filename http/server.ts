import { ServeInit, Server } from "$fastro/http/deps.ts";
import { handler as createHandler } from "$fastro/http/handler.ts";
import { router as createRouter } from "$fastro/http/router.ts";
import {
  Application,
  HandlerArgument,
  LOCALHOST,
  PathArgument,
  Route,
  Router,
  SPLITTER,
} from "$fastro/http/types.ts";

export default function app(): Application {
  const router = createRouter();
  let server: Server;
  let routes: Map<string, Route>,
    portNumber: number | undefined,
    hostName: string | undefined;
  const app = {
    serve: (options: ServeInit = {}) => {
      portNumber = options?.port || 9000;
      hostName = options?.hostname || LOCALHOST;
      routes = initRoutes(portNumber, hostName, router);
      server = new Server(
        {
          onError: options.onError,
          hostname: options.hostname,
          port: options.port,
          handler: (req) => createHandler(req, hostName, portNumber, routes),
        },
      );

      return server.serve(
        Deno.listen({ hostname: hostName, port: portNumber }),
      );

      /*
      return Deno.serve({
        port: portNumber,
        hostname: hostName,
        onError(error: unknown) {
          const err = <string> error;
          return new Response(err, {
            status: INTERNAL_SERVER_ERROR_STATUS,
            statusText: err,
          });
        },
        onListen({ port, hostname }) {
          hostName = hostname;
          portNumber = port;
          routes = initRoutes(port, hostname, router);
          if (options && options.callback) options.callback();
          else console.log(`Server started at http://${hostname}:${port}`);
        },
      }, (req) => createHandler(hostName, portNumber, req, routes));
      */
    },
    get: (path: PathArgument, handler: HandlerArgument) => {
      router.get(path, handler);
      return app;
    },
    post: (path: PathArgument, handler: HandlerArgument) => {
      router.post(path, handler);
      return app;
    },
    put: (path: PathArgument, handler: HandlerArgument) => {
      router.put(path, handler);
      return app;
    },
    delete: (path: PathArgument, handler: HandlerArgument) => {
      router.delete(path, handler);
      return app;
    },
    head: (path: PathArgument, handler: HandlerArgument) => {
      router.head(path, handler);
      return app;
    },
    patch: (path: PathArgument, handler: HandlerArgument) => {
      router.patch(path, handler);
      return app;
    },
    options: (path: PathArgument, handler: HandlerArgument) => {
      router.options(path, handler);
      return app;
    },
    use: (path: PathArgument, handler: HandlerArgument) => {
      router.use(path, handler);
      return app;
    },
  };

  function initRoutes(port: number, hostname: string, router: Router) {
    const routes: Map<string, Route> = new Map();
    router.routes.forEach((value, key) => {
      const splitted = key.split(SPLITTER);
      const newKey = `${splitted[0]}${SPLITTER}http://${hostname}:${port}${
        splitted[2]
      }`;
      routes.set(newKey, value);
    });
    router.routes.clear();
    return routes;
  }

  return app;
}
