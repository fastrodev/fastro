import { Fastro } from "../mod.ts";

const server = new Fastro();

server
  .function("/prefix/function", (req) => {
    if (!req.url.includes("/prefix/function")) return server.forward(req);
    req.send(req.functionParameter);
  })
  .function("/hi/:name", (req) => {
    req.send(req.functionParameter);
  })
  .function("/:hi/people", (req) => {
    req.send(req.functionParameter);
  })
  .function("/:hello/:name", (req) => {
    req.send(req.functionParameter);
  });

server
  .use("/middleware", (req) => req.send("middleware"))
  .get("/", (req) => req.send("root"));

await server.listen({ port: 8000 });
