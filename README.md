![ci](https://github.com/fastrojs/fastro-server/workflows/ci/badge.svg)
# Fastro
Fast, unopinionated, minimalist web framework for [deno](https://deno.land/)

```ts
import {
  Fastro,
} from "https://deno.land/x/fastro/mod.ts";

const server = new Fastro();

server.route({
  method: "GET",
  url: "/",
  handler: (req) => req.send("hello"),
});

await server.listen({ port: 8000 });

```

## Example
You can see above basic example code here: [hello.ts](examples/hello.ts)

Check the following source code to find out how to:
- [send simple text & json data](examples/main.ts#L5)
- [handling url parameters](examples/main.ts#L35)
- [set custom http headers & status](examples/main.ts#L25)
- [handling http posts & get the payload](examples/main.ts#L47)
- [add optional callback](examples/main.ts#L58)
