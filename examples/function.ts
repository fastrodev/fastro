import { Fastro } from "../mod.ts";

const server = new Fastro();

server.function("/prefix/function", (req) => {
  if (!req.url.includes("/prefix/function")) return server.forward(req);
  req.send(req.functionParameter);
});

server
  .use("/ok", (req) => req.send("ok"))
  .get("/", (req) => req.send("root"));

await server.listen({ port: 8000 });
