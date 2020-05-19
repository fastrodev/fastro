import { Fastro } from "../mod.ts";

const server = new Fastro();

// add a router using route shorthand declaration
server.get("/", (req) => req.send("root"));

// add a router using `route` method
server.route({
  url: "/hello",
  method: "GET",
  handler: (req) => {
    req.send("hello");
  },
});

await server.listen({ port: 8000 });
