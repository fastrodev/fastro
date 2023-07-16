import { HttpServer } from "../http/mod.ts";
export default function (options?: { port?: number }) {
  return new HttpServer(options);
}
