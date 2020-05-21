import { Fastro, FastroError, FastroRequest } from "../mod.ts";

const server = new Fastro();

// make a plugin that contains a function that reads parameters, payload, or header.
// you can do anything, for example comparing it with stored data.
// or just console.log it.
function parameterPlugin(req: FastroRequest) {
  console.log(req.parameter);
}

function payloadPlugin(req: FastroRequest) {
  console.log(req.payload);
}

function headerPlugin(req: FastroRequest) {
  console.log(req.headers);
}

server
  .use(parameterPlugin)
  .use(payloadPlugin)
  .use(headerPlugin)
  .get("/:hello", (req) => req.send("hello"))
  .post("/:hello", (req) => req.send("hello"));

await server.listen({ port: 8000 });
