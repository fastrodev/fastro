![ci](https://github.com/fastrojs/fastro-server/workflows/ci/badge.svg)
# Fastro
Deno fast web framework

Usage example:
```ts
import { Fastro, FastroError } from "https://deno.land/x/fastro/mod.ts";
import { decode } from "https://deno.land/std@0.51.0/encoding/utf8.ts";
const { readAll } = Deno;

const server = new Fastro();
server
  .route({
    method: "GET",
    url: "/",
    handler: (req) => {
      req.respond({ body: "Root" });
    },
  })
  .route({
    method: "GET",
    url: "/:hello",
    handler: (req) => {
      req.respond({ body: JSON.stringify(req.parameter)});
    },
  })
  .route({
    method: "GET",
    url: "/hello/:user/:id",
    handler: (req) => {
      req.respond({ body: JSON.stringify(req.parameter)});
    },
  })
  .route({
    method: "POST",
    url: "/hello",
    handler: async (req) => {
      const payload = decode(await readAll(req.body));
      req.respond({ body: payload });
    },
  })
  .callback = function (err: Error | undefined, addr: Deno.Addr | undefined) {
    if (err) throw FastroError("SERVER_ERROR", err);
    console.log("Listening on:", addr);
  };

await server.listen({ port: 8000 });


```
