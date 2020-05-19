import { Fastro, FastroError } from "../mod.ts";

const server = new Fastro();
server
  // handle simple message using route shorthand declaration
  .get("/", (req) => req.send("hello"))
  // handle json object
  .route({
    method: "GET",
    url: "/json",
    handler: (req) => {
      req.send({ message: "hello" });
    },
  })
  // handle basic url parameter & respon with custom status & header
  .route({
    method: "GET",
    url: "/:hello",
    handler: (req) => {
      const status = 200;
      const headers = new Headers();
      headers.set("X-Made-In", "Cirebon, ID");
      headers.set("X-Author", "ynwd");
      req.send(`Hello, ${req.parameter.hello}`, status, headers);
    },
  })
  // handle multiple parameter
  .route({
    method: "GET",
    url: "/hello/:user/:id",
    handler: (req) => {
      const data = {
        user: req.parameter.user,
        id: req.parameter.id,
      };
      req.send(data);
    },
  })
  // handle post & get the payload
  .route({
    method: "POST",
    url: "/hello",
    handler: (req) => {
      const payload = req.payload;
      req.send(payload);
    },
  })
  // optional callback
  .callback = (err, addr) => {
    if (err) throw FastroError("SERVER_ERROR", err);
    console.log("Listening on:", addr);
  };

await server.listen({ port: 8000 });
