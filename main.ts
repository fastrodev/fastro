import { Fastro, ServerRequest } from "./server.ts";
import { decode } from "https://deno.land/std@0.51.0/encoding/utf8.ts";
const { readAll } = Deno;

const server = new Fastro();
server.route({
  method: "GET",
  url: "/",
  handler: (req: ServerRequest) => {
    req.respond({ body: "Root" });
  },
});
server.route({
  method: "GET",
  url: "/hello",
  handler: (req: ServerRequest) => {
    req.respond({ body: "Hello World\n" });
  },
});
server.route({
  method: "POST",
  url: "/hello",
  handler: async (req: ServerRequest) => {
    const payload = decode(await readAll(req.body));
    req.respond({ body: payload });
  },
});
server.listen({ port: 8000 });