import { Fastro, Request } from "../mod.ts";

const server = new Fastro();

// compare parameter with local variable
function parameterPlugin(req: Request) {
  const data = "hello";
  if (req.parameter && req.parameter.hello === data) {
    console.log(req.parameter);
  }
}

// get client headers & custom send method
function sendOk(req: Request) {
  console.log(req.headers.get("host"));
  req.sendOk = (payload: string) => {
    const headers = new Headers();
    headers.set("X-token", "your_token");
    return req.send(payload, 200, headers);
  };
}

// add new function & property
function authPlugin(req: Request) {
  const token = req.headers.get("token");
  if (!token) return req.send("token not found");
}

// add plugins to server
server
  .use(authPlugin)
  .use(sendOk)
  .use(parameterPlugin);

server
  .get("/:hello", (req) => req.send("hello"))
  .post("/:hello", (req) => {
    // access new property
    console.log("new property:", req.newProp);
    // access new function
    req.ok("hello");
    // access custom send function
    req.sendOk("ok deh");
  });

await server.listen({ port: 8000 });
