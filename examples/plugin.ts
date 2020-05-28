import { Fastro } from "../mod.ts";
const server = new Fastro();

server
  // .use((req) => {
  //   req.hello = "hello";
  // })
  // .use((req) => {
  //   req.ok = "ok";
  // })
  .use((req) => {
    req.send("root");
  })
  .use("/ok", (req) => {
    req.send("ok");
  })
  .get('/hi', (req) => {
    req.send("hi");
  })

await server.listen({ port: 8000 });
