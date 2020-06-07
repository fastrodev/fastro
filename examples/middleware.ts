import { Fastro } from "../mod.ts";
const server = new Fastro();

server
  // add new property to request object
  // if no url mentioned, default is "/"
  .use((req, done) => {
    req.yes = "yes";
    done();
  })
  // call req.send() inside middleware
  .use("/hello", (req) => {
    req.send("hello middleware");
  })
  // it can only be accessed from the url that has been registered.
  .use("/ok", (req, done) => {
    req.ok = "ok";
    done();
  })
  // get param from middleware
  .use("/yes/:user", (req, done) => {
    req.ok = req.parameter
    done();
  })
  .get("/", (req) => {
    console.log(req.ok); // ok
    console.log(req.yes); // undefined
    req.send("root");
  })
  .get("/yes/:user", (req) => {
    req.send(req.ok);
  })
  .get("/ok", (req) => {
    console.log(req.ok); // undefined
    console.log(req.yes); // yes
    req.send("ok");
  });

await server.listen({ port: 8000 });
