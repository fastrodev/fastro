import { Fastro, FastroOptions, HandlerOptions } from "./types.ts";
import { Handler, serve } from "./deps.ts";
import { router } from "./router.ts";
import { createHandler } from "./handler.ts";

export default function (opt?: FastroOptions): Fastro {
  console.log(opt);
  const r = router();

  return {
    serve: async function (port?: number): Promise<void> {
      await serve(createHandler(r.router), { port });
    },
    get: (url: string, opts: HandlerOptions, handler: Handler) => {
      r.get(url, opts, handler);
    },
    post: (url: string, opts: HandlerOptions, handler: Handler) => {
      r.post(url, opts, handler);
    },
    put: (url: string, opts: HandlerOptions, handler: Handler) => {
      r.put(url, opts, handler);
    },
    patch: (url: string, opts: HandlerOptions, handler: Handler) => {
      r.patch(url, opts, handler);
    },
    delete: (url: string, opts: HandlerOptions, handler: Handler) => {
      r.delete(url, opts, handler);
    },
    head: (url: string, opts: HandlerOptions, handler: Handler) => {
      r.head(url, opts, handler);
    },
    options: (url: string, opts: HandlerOptions, handler: Handler) => {
      r.options(url, opts, handler);
    },
  };
}
