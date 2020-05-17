![ci](https://github.com/fastrojs/fastro-server/workflows/ci/badge.svg)
# Fastro
Deno fast web framework

Usage example:
```ts
import { Fastro, FastroError } from "https://deno.land/x/fastro/mod.ts";
import { decode } from "https://deno.land/std@0.51.0/encoding/utf8.ts";
import { ServerRequest } from "https://deno.land/std@0.51.0/http/server.ts";
const { readAll } = Deno;

const server = new Fastro();
server
  .route({
    method: "GET",
    url: "/",
    handler: (req: ServerRequest) => {
      req.respond({ body: "Root" });
    },
  })
  .route({
    method: "GET",
    url: "/hello",
    handler: (req: ServerRequest) => {
      req.respond({ body: "Hello World\n" });
    },
  })
  .route({
    method: "POST",
    url: "/hello",
    handler: async (req: ServerRequest) => {
      const payload = decode(await readAll(req.body));
      req.respond({ body: payload });
    },
  })
  .callback = function (err: Error | undefined, addr: Deno.Addr | undefined) {
    if (err) throw FastroError("SERVER_ERROR", err);
    console.log("Listening on:", addr);
  };

server.listen();


```
