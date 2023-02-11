import { DELETE, GET, OPTIONS, PATCH, POST, PUT } from "./constant.ts";
import { ServeInit, Server } from "./deps.ts";
import { createHandler } from "./handler.ts";
import {
  Fastro,
  HandlerArgument,
  Route,
  SSR,
  SSRHandler,
  StartOptions,
} from "./types.ts";

export function fastro(_startOptions?: StartOptions): Fastro {
  const routes: Array<Route> = [];
  const pages: Array<SSRHandler> = [];
  const ac = new AbortController();
  let staticFolder = "./public";
  let staticPath = "/";
  let _server: Server;

  const app = {
    serve: (serveOptions: ServeInit) => {
      const hostname = serveOptions?.hostname || "127.0.0.1";
      const port = serveOptions?.port || 9000;
      const baseUrl = `http://${hostname}:${port}`;
      const baseStaticPath = `${baseUrl}${staticPath}`;
      const cache = {};

      for (const p of pages) {
        const rootComponent = `App`;
        const bundle = p.ssr._getBundleName();
        const rootTSX = bundle;
        p.ssr._createBundle(bundle, rootComponent, rootTSX);
      }

      const handler = createHandler(
        routes,
        baseStaticPath,
        staticFolder,
        cache,
        pages,
      );

      return Deno.serve({
        hostname,
        port,
        handler,
        onListen: serveOptions?.onListen,
        onError: serveOptions?.onError,
        signal: ac.signal,
      });

      // server = new Server({
      //   hostname,
      //   port,
      //   handler,
      //   onError: serveOptions?.onError,
      // });
      // console.info(`Listening on http://${hostname}:${port}/`);
      // return server.listenAndServe();
    },
    static: (path: string, folder?: string) => {
      staticPath = path;
      if (folder) staticFolder = folder;
      return app;
    },
    close: () => {
      return ac.abort();
      // if (startOptions && startOptions.flash) {
      //   return ac.abort();
      // }
      // return server.close();
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
    page: (
      path: string,
      ssr: SSR,
      handler: HandlerArgument,
    ) => {
      pages.push({ path, ssr, handler });
      return app;
    },
  };
  return app;
}
