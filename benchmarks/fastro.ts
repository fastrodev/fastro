import { Fastro } from "../mod.ts";
const server = new Fastro();
const port = 3000;
server.get("/", (req) => req.send("hello"));
await server.listen({ port }, (err, addr) => {
  console.log("fastro listening on:", port);
});
