import { Route } from "./types.ts";

export function createHandler(map: Map<string, Route>) {
  return function (request: Request): Response {
    return new Response("Hello World\n");
  };
}
