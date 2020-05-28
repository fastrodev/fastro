import { Fastro } from "../mod.ts";
const server = new Fastro();

server
  // global plugin
  // it can be accessed from any URL.
  .use((req) => {
    req.hello = "hello";
  })
  // url plugin
  // it can only be accessed from the url that has been registered.
  .use("/ok", (req) => {
    req.sendOk = (payload: string) => {
      req.send(payload);
    };
  })
  .get("/ok", (req) => {
    console.log(req.hello);
    req.sendOk("ok");
  });

await server.listen({ port: 8000 });
