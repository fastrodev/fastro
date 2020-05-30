## Examples

## Quick Start

```ts
import { Fastro } from "https://deno.land/x/fastro/mod.ts";

const server = new Fastro();

server.get("/", (req) => req.send("root"));

await server.listen();

```

You can see above basic example code here: [hello.ts](https://github.com/fastrojs/fastro-server/blob/master/examples/hello.ts)

Check the following codes to find out how to:
- [send simple text & json data](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L5)
- [handle url parameters](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L20)
- [set custom http headers & status](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L9)
- [handle http posts & get the payload](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L28)
- [change default port & listen optional callback](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L34)
- [create simple Postgres REST API](https://github.com/fastrojs/fastro-server/blob/master/examples/crud_postgres.ts)

## Middleware

- [create very simple middleware](https://github.com/fastrojs/fastro-server/blob/master/examples/use_middleware.ts#L6)
- [create middleware in separate file](https://github.com/fastrojs/fastro-server/blob/master/middleware/sample.ts)
- [import middleware from external file](https://github.com/fastrojs/fastro-server/blob/master/examples/use_middleware.ts#L2)
- [create simple jwt auth](https://github.com/fastrojs/fastro-server/blob/master/examples/simple_jwt_auth.ts)
- [create global & url middleware](https://github.com/fastrojs/fastro-server/blob/master/examples/middleware.ts)
- [create simple REST API with JWT](https://github.com/fastrojs/fastro-server/blob/master/examples/rest_api_jwt)

## Decorator
- [create a new server property](https://github.com/fastrojs/fastro-server/blob/master/examples/decorate.ts).

## Plugin
- [create & register a plugin](https://github.com/fastrojs/fastro-server/blob/master/examples/plugin.ts).