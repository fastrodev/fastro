![fastro][logo]

![ci][ci]

**Fastro** is web framework for developers obsessed with performance and simplicity. 

It is inspired by [Fastify](https://www.fastify.io/) & [Express](https://expressjs.com/).

```ts
import { Fastro } from "https://deno.land/x/fastro@v0.8.1/mod.ts";
const server = new Fastro();
server.get("/", (req) => req.send("root"));
await server.listen();
```

## How to use

This module uses the git release. If you want to pick a specific version, for example `0.8.1`, then the full url is [`https://deno.land/x/fastro@v0.8.1/mod.ts`](https://deno.land/x/fastro@v0.8.1/mod.ts). If you do not use the version, it will refer to `master` branch. Breaking changes may be made without warning.

## Benchmarks
If performance is important to you, here are the `Hello World` benchmark results:

| Framework | Version | Router? | Avg Req |
| :-- | :-- | :--: | --: |
| [Deno http](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/deno_http.ts) | 1.0.5 | &#10007; | [17107.6](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/benchmark_deno.json) |
| [Node http](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/node_http.js) | 14.3.0 | &#10007; | [16387.8](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/benchmark_node.json) |
| [**Fastro**](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/fastro.ts) | **0.8.1** | **&#10003;** | **[14898.8](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/benchmark_fastro.json)**  |
| [Fastify](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/fastify.js) | 2.14.1 | &#10003; | [12829](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/benchmark_fastify.json) |
| [Abc](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/abc.ts) | 1.0.0-rc10 | &#10003; | [11234.6](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/benchmark_abc.json) |
| [Oak](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/oak.ts) | 4.0.0 | &#10003; | [10655.6](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/benchmark_oak.json) |
| [Express](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/express.js) | 4.17.1 | &#10003; | [6740.28](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/benchmark_express.json) |
| [PHP](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/index.php) | 7.3.11 | &#10007; | [5565.3](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/benchmark_php.json) |
| [Python Flask](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/flask_app.py) | 1.1.2 | &#10003; | [508.3](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/benchmark_flask.json) |


Check [this folder](https://github.com/fastrojs/fastro-server/tree/master/benchmarks) to see the details.

## Middleware

You can add new properties or functions to the default `request`. This is similar to the [express middleware](https://expressjs.com/en/guide/writing-middleware.html).
```ts
const middleware = (req: Request, done: Function) => {
  req.oke = () => req.send("oke");
  done();
};

server
  .use(middleware)
  .get("/", (req) => req.oke());
```

## Decorator

Another way to add a new property or function to the fastro instance and `request` object is to use a decorator. This is similar to the [fastify decorator](https://www.fastify.io/docs/latest/Decorators/).
```ts
server
  .decorate((instance) => instance.ok = "ok")
  .decorate((instance) => instance.hello = (payload: string) => payload)
  .decorateRequest((req) => req.oke = "oke request");

server
  .get("/", (req) => req.send(server.ok))
  .get("/hello", (req) => req.send(server.hello("hello")))
  .get("/oke", (req) => req.send(req.oke));
```

## Plugin
You can add new properties or functions to the fastro instance. You can also use all default instance functions, include decorator, create routes & middleware. This is similar to the [fastify plugin](https://www.fastify.io/docs/latest/Plugins/).
```ts
const routes = function (fastro: Fastro, done: Function) {
  fastro
    .get("/", (req) => req.send("root"))
    .post("/", (req) => req.send("post"))
    .put("/", (req) => req.send("put"))
    .delete("/", (req) => req.send("delete"));
  done();
};

server.register(routes);

```

## Examples

Check [this folder](https://github.com/fastrojs/fastro-server/tree/master/examples) to find out how to:
- [create hello world app](https://github.com/fastrojs/fastro-server/blob/master/examples/hello.ts)
- [change default port & add optional listen callback](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L34)
- [send simple text & json data](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L5)
- [get url parameters](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L20)
- [get payload from post method](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L30)
- [set custom http headers & status](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L9)
- [change the request object by creating a middleware](https://github.com/fastrojs/fastro-server/blob/master/examples/use_middleware.ts#L6)
- [create simple jwt auth](https://github.com/fastrojs/fastro-server/blob/master/examples/simple_jwt_auth.ts)
- [create middleware](https://github.com/fastrojs/fastro-server/blob/master/examples/middleware.ts)
- [create decorator to add new property](https://github.com/fastrojs/fastro-server/blob/master/examples/decorate.ts)
- [create router with plugin](https://github.com/fastrojs/fastro-server/blob/master/examples/plugin.ts)
- [create nested plugin](https://github.com/fastrojs/fastro-server/blob/master/examples/nested_plugin.ts)
- [create simple REST API](https://github.com/fastrojs/fastro-server/blob/master/examples/crud_postgres.ts)
- [create simple REST API with JWT](https://github.com/fastrojs/fastro-server/blob/master/examples/rest_api_jwt)

[logo]: https://repository-images.githubusercontent.com/264308713/f557a280-a8f0-11ea-979a-dbc1c49c0529 "Fastro"
[ci]: https://github.com/fastrojs/fastro-server/workflows/ci/badge.svg "ci"

