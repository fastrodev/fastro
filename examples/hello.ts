import { Fastro } from "../mod.ts";

const server = new Fastro();

// ADD a router using route shorthand declaration
// Available route shorthand declaration
// - `server.get(url, handler)`
// - `server.post(url, handler)`
// - `server.put(url, handler)`
// - `server.head(url, handler)`
// - `server.delete(url, handler)`
// - `server.options(url, handler)`
// - `server.patch(url, handler)`
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
