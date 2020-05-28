import { Fastro, Request } from "../mod.ts";

const server = new Fastro();

const plugin = function (fastro: Fastro, request: Request) {
  fastro.hello = "hello plugin";
  request.ok = "ok plugin";
};

server
  .register(plugin)
  .get("/", (req) => {
    req.send(server.hello);
  })
  .get("/ok", (req) => {
    req.send(req.ok);
  });

await server.listen();
