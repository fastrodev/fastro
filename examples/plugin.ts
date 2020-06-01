import { Fastro } from "../mod.ts";

const server = new Fastro();

// define routes inside plugin
// you must call done callback in the end of handler
// to make sure instance modification is saved
const routes = function (fastro: Fastro, done: Function) {
  fastro
    .get("/:first/:second", (req) => {
      // access url parameter inside handler
      req.send(req.parameter);
    })
    .post("/hi", (req) => {
      req.send("hi");
    });
  done();
};

server
  // create in line plugin
  // you must call done callback in the end of handler
  // to make sure instance modification is saved
  .register((fastro, done) => {
    fastro.root = "root";
    done();
  })
  // add plugin
  .register(routes)
  // add plugin with different prefix
  // you can access url with url: http://localhost/v1/param1/param2
  .register("v1", routes)
  // you can access url with url: http://localhost/v2/param1/param2
  .register("v2", routes)
  .get("/", (req) => {
    // access 'root' property from handler
    req.send(server.root);
  });

await server.listen();
