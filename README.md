![ci](https://github.com/fastrojs/fastro-server/workflows/ci/badge.svg)
# Fastro
Fast, unopinionated, minimalist web framework for [deno](https://deno.land/)

Usage example:

```ts
import { Fastro, FastroError } from "https://deno.land/x/fastro/mod.ts";
import { Fastro, FastroError } from "./server.ts";

const server = new Fastro();
server
  // handling simple message
  .route({
    method: "GET",
    url: "/",
    handler: (req) => {
      req.send("hello");
    },
  })
  // handling json object
  .route({
    method: "GET",
    url: "/json",
    handler: (req) => {
      req.send({ message: "hello" });
    },
  })
  // handling basic url parameter & respon with custom http status & header
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
  // handling multiple parameter
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
  // handling post & get the payload
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

```
