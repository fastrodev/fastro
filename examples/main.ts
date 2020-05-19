import { Fastro, FastroError } from "https://deno.land/x/fastro/mod.ts";

const server = new Fastro();
server
  // handle simple message
  .route({
    method: "GET",
    url: "/",
    handler: (req) => {
      req.send("hello");
    },
  })
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
      const header = new Headers();
      header.set("Content-Type", "application/json");
      req.respond({
        status: 200,
        headers: header,
        body: JSON.stringify(req.parameter),
      });
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
