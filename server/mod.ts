import fastro from "$fastro/http/server.ts";
export default function (options?: { port?: number }) {
  return new fastro(options);
}
