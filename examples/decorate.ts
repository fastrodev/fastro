import { Fastro } from "../mod.ts";
const server = new Fastro();
server
  .decorate((instance) => {
    instance.ok = "ok";
  })
  .decorate((instance) => {
    instance.hello = (payload: string) => {
      return payload;
    };
  });

server
  .get("/", (req) => {
    req.send(server.ok);
  })
  .get("/hello", (req) => {
    req.send(server.hello("hello"));
  });

await server.listen({ port: 8000 });
