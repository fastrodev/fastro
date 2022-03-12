import { Route } from "./types.ts"

export function createHandler(_map: Map<string, Route>) {
  return function (_request: Request): Response {
    return new Response("Hello World!\n")
  }
}
