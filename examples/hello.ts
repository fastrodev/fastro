import { Fastro } from "https://deno.land/x/fastro/mod.ts";

const server = new Fastro();

server.get("/", (req) => req.send("root"));

server.route({
  url: "/hello",
  method: "GET",
  handler: (req) => {
    req.send("hello");
  },
});

await server.listen({ port: 8000 });
