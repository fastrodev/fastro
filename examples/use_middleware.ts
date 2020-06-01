import { Fastro, Request, sendOk, support } from "../mod.ts";

const server = new Fastro();

// you may not send a response more than once in a request
function sendHi(req: Request) {
  if (false) return req.send("Hello");
}

// add middleware to server
server
  .use(sendHi)
  // add sendOk middleware from external file
  .use(sendOk)
  // add support middleware from external file
  .use(support);

server
  // use sendOk middleware
  .get("/", (req) => req.sendOk("hello"))
  .post("/:hello", (req) => {
    // access custom send function
    req.sendOk("ok deh");
  });

await server.listen({ port: 8000 });
