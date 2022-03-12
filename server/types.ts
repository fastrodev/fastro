import { Handler } from "https://deno.land/std@0.125.0/http/server.ts";

export type HandlerOptions = {};

export type FastroOptions = {
  logger: true;
};

export interface Fastro {
  serve(port?: number): Promise<void>;
  get(url: string, opts: HandlerOptions, handler: Handler): void;
  post(url: string, opts: HandlerOptions, handler: Handler): void;
  put(url: string, opts: HandlerOptions, handler: Handler): void;
  patch(url: string, opts: HandlerOptions, handler: Handler): void;
  delete(url: string, opts: HandlerOptions, handler: Handler): void;
  head(url: string, opts: HandlerOptions, handler: Handler): void;
  options(url: string, opts: HandlerOptions, handler: Handler): void;
}

export interface Route {
  method: string;
  url: string;
  options: HandlerOptions;
  handler: Handler;
}

export interface Router {
  get(url: string, opts: HandlerOptions, handler: Handler): Router;
  post(url: string, opts: HandlerOptions, handler: Handler): Router;
  put(url: string, opts: HandlerOptions, handler: Handler): Router;
  patch(url: string, opts: HandlerOptions, handler: Handler): Router;
  delete(url: string, opts: HandlerOptions, handler: Handler): Router;
  head(url: string, opts: HandlerOptions, handler: Handler): Router;
  options(url: string, opts: HandlerOptions, handler: Handler): Router;
  router: Map<string, Route>;
}
