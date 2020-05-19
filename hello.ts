import {
  Fastro,
} from "https://deno.land/x/fastro/mod.ts";

const server = new Fastro();

server.route({
  method: "GET",
  url: "/",
  handler: (req) => req.send("hello"),
});

await server.listen({ port: 8000 });
