# Fastro

![ci](https://github.com/fastrojs/fastro-server/workflows/ci/badge.svg)

Deno web framework for developers who are obsessed with performance and simplicity.

Inspired by [Fastify](https://www.fastify.io/) & [Express](https://expressjs.com/).

```ts
import { Fastro } from "https://deno.land/x/fastro/mod.ts";

const server = new Fastro();

server.get("/", (req) => req.send("root"));

await server.listen();

```

## Benchmarks
If performance is important to you, here are the benchmark results:

| Framework | Version | Router? | Avg Req |
| :-- | :-- | :--: | --: |
| Abc | 1.0.0-rc8 | &#10003; | 1144.8 |
| Deno `http` | 1.0.3 | &#10007; | 2286.6 |
| Express | 4.17.1 | &#10003; | 551 |
| Fastify | 2.14.1 | &#10003; | 1462.7 |
| **Fastro** | **0.5.4** | **&#10003;** | **1766.1**  |
| Node `http` | 14.3.0 | &#10007; | 2011.3 |
| Oak | 4.0.0 | &#10003; | 1052.5 |

Check [this folder](https://github.com/fastrojs/fastro-server/tree/master/benchmarks) to see the detail method.

## Middleware

You can add new properties or functions to the default `request`. This feature is similar to the [express middleware](https://expressjs.com/en/guide/writing-middleware.html).
```ts
const middleware = (req: Request) => {
  req.hi = (word: string) => {
    req.send(word);
  };
};

server.use(middleware);
```

## Plugin
You can add new properties or functions to fastro instance. You can also bundle several routes in one plugin. This is similar to the [fastify plugin](https://www.fastify.io/docs/latest/Plugins/).
```ts
const routes = function (fastro: Fastro) {
  fastro
    .get("/", (req) => {
      req.send("root");
    })
    .post("/", (req) => {
      req.send("post");
    });
};

server.register(routes);

```

## How to use

This module uses the git release. If you want to pick a specific version, for example `v0.5.4`, then the full url is [`https://deno.land/x/fastro@v0.5.4/mod.ts`](https://deno.land/x/fastro@v0.5.4/mod.ts). If you do not use the version, it will refer to `master` branch.

## Examples

Check [this folder](https://github.com/fastrojs/fastro-server/tree/master/examples) to find out how to: 
- [change default port & add optional listen callback](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L34)
- [send simple text & json data](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L5)
- [get url parameters](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L20)
- [get payload from post method](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L30)
- [set custom http headers & status](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L9)
- [change the request object by creating a middleware](https://github.com/fastrojs/fastro-server/blob/master/examples/use_middleware.ts#L6)
- [create simple jwt auth](https://github.com/fastrojs/fastro-server/blob/master/examples/simple_jwt_auth.ts)
- [create global & url middleware](https://github.com/fastrojs/fastro-server/blob/master/examples/middleware.ts)
- [create decorator to add new property](https://github.com/fastrojs/fastro-server/blob/master/examples/decorate.ts)
- [create router with plugin](https://github.com/fastrojs/fastro-server/blob/master/examples/plugin.ts)
- [create simple REST API](https://github.com/fastrojs/fastro-server/blob/master/examples/crud_postgres.ts)
- [create simple REST API with JWT](https://github.com/fastrojs/fastro-server/blob/master/examples/rest_api_jwt)

