import { HttpServer } from "../http/server.ts";
export * from "../http/server.ts";
export default function (options?: { port?: number }) {
  return new HttpServer(options);
}
