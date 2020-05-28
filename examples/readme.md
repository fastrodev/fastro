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

## Create a middleware
You can add new properties or functions to the default `request`.

This feature is similar to the [fastify decorator](https://www.fastify.io/docs/latest/Decorators/) and [express middleware](https://expressjs.com/en/guide/writing-middleware.html).


```ts
import { Fastro, Request } from "https://deno.land/x/fastro/mod.ts";
const server = new Fastro();
const middleware = (req: Request) => {
  req.hello = () => {
    return req.send("Hello");
  };
}
server
  .use(middleware)
  .get("/:hello", (req) => req.hello());
await server.listen();

```

Check the following codes to find out how to:
- [import middleware from external file](https://github.com/fastrojs/fastro-server/blob/master/examples/use_middleware.ts)
- [create simple jwt auth](https://github.com/fastrojs/fastro-server/blob/master/examples/simple_jwt_auth.ts)
- [create global & url plugin](https://github.com/fastrojs/fastro-server/blob/master/examples/middleware.ts).

## Decorator
You can add new properties or functions to Fastro instance. This feature is similar to the [fastify decorator](https://www.fastify.io/docs/latest/Decorators/).
- [create a new server property](https://github.com/fastrojs/fastro-server/blob/master/examples/decorate.ts).