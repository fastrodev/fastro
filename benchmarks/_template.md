## Web framework for developers obsessed with performance and simplicity
![ci](https://github.com/fastrojs/fastro-server/workflows/ci/badge.svg)

Fastro is inspired by [Fastify](https://www.fastify.io/) & [Express](https://expressjs.com/).

```ts
import { Fastro } from "https://deno.land/x/fastro/mod.ts";
const server = new Fastro();
server.get("/", (req) => req.send("root"));
await server.listen();
```

### Benchmarks
If performance is important to you, here are the benchmark results:

| Framework | Version | Router? | Avg Req |
| :-- | :-- | :--: | --: |
| Abc | ${abc_version} | &#10003; | ${abc} |
| Deno `http` | ${deno_version} | &#10007; | ${deno_http} |
| Express | ${express_version} | &#10003; | ${express} |
| Fastify | ${fastify_version} | &#10003; | ${fastify} |
| **Fastro** | **${fastro_version}** | **&#10003;** | **${fastro}**  |
| Node `http` | ${node_version} | &#10007; | ${node} |
| Oak | ${oak_version} | &#10003; | ${oak} |

Check [this folder](https://github.com/fastrojs/fastro-server/tree/master/benchmarks) to see the detail method.

### Middleware

You can add new properties or functions to the default `request`. This is similar to the [express middleware](https://expressjs.com/en/guide/writing-middleware.html).
```ts
const middleware = (req: Request) => {
  req.hi = (word: string) => {
    req.send(word);
  };
};

server.use(middleware);
```

### Plugin
You can add new properties or functions to the fastro instance. You can also use all default instance functions, include create routes & middleware. This is similar to the [fastify plugin](https://www.fastify.io/docs/latest/Plugins/).
```ts
const routes = function (fastro: Fastro) {
  fastro
    .get("/", (req) => {
      req.send("root");
    })
    .post("/", (req) => {
      req.send("post");
    })
    .put("/", (req) => {
      req.send("put");
    })
    .delete("/", (req) => {
      req.send("delete");
    });
};

server.register(routes);

```

### How to use

This module uses the git release. If you want to pick a specific version, for example `v0.6.0`, then the full url is [`https://deno.land/x/fastro@v0.6.0/mod.ts`](https://deno.land/x/fastro@v0.6.0/mod.ts). If you do not use the version, it will refer to `master` branch.

### Examples

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

