import fastro from "../http/server.ts";
export default function (options?: { port?: number }) {
  return new fastro(options);
}
