import { Fastro, Request } from "../mod.ts";

const server = new Fastro();

// add new property to fastro instance
const plugin = function (fastro: Fastro) {
  fastro.root = "root";
};

// call get function from plugin
const get = function (fastro: Fastro) {
  fastro.get("/hello", (req) => {
    req.send("hello");
  });
};

// call post function from plugin
const post = function (fastro: Fastro) {
  fastro.post("/hello", (req) => {
    req.send("hello");
  });
};

server
  .register(get)
  .register(post)
  .register(plugin)
  .get("/", (req) => {
    // access 'root' property from get handler
    req.send(server.root);
  });

await server.listen();
