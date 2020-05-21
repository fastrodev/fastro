import { Fastro, FastroError, FastroRequest } from "../mod.ts";

const server = new Fastro();

// compare parameter with local variable
function parameterPlugin(req: FastroRequest) {
  const data = 'hello'
  if (req.parameter.hello === data) {
    console.log(req.parameter);
  }
}

// get client headers & custom send method
function sendOk(req: FastroRequest) {
  console.log(req.headers.get('host'))
  req.sendOk = (payload: string) => {
    const headers = new Headers()
    headers.set('X-token', 'your_token')
    return req.send(payload, 200, headers)
  }
}

// add new function & property
function payloadPlugin(req: FastroRequest) {
  req.newProp = new Date()
  req.ok = function(param: string) {
    console.log('param inside plugin:', param)
  }
}

// add plugins to server
server
  .use(payloadPlugin)
  .use(parameterPlugin)
  .use(sendOk)
  
server
  .get("/:hello", (req) => req.send("hello"))
  .post("/:hello", (req) => {
    // access new property
    console.log('new property:', req.newProp)
    // access new function
    req.ok('hello')
    // access custom send function
    req.sendOk('ok deh')
  });

await server.listen({ port: 8000 });
