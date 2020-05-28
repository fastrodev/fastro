import { Fastro, Request } from "../mod.ts";
import { sendOk, support } from "../plugins/mod.ts";

const server = new Fastro();

// you may not send a response more than once in a request
function sendHi(req: Request) {
  if (false) return req.send("Hello");
}

// add plugins to server
server
  .use(sendHi)
  // add sendOk plugin from external file
  .use(sendOk)
  // add support plugin from external file
  .use(support);

server
  // use sendOk plugin
  .get("/", (req) => req.sendOk("hello"))
  .post("/:hello", (req) => {
    // access custom send function
    req.sendOk("ok deh");
  });

await server.listen({ port: 8000 });
