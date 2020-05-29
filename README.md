# Fastro
Fast & simple web framework for [Deno](https://deno.land/). 

Inspired by [Fastify](https://www.fastify.io/) & [Express](https://expressjs.com/).

```ts
import { Fastro } from "https://deno.land/x/fastro/mod.ts";

const server = new Fastro();

server.get("/", (req) => req.send("root"));

await server.listen();

```

## How to use & examples

This module uses the git release. If you want to pick a specific version, for example `v0.5.0`, then the full url is [`https://deno.land/x/fastro@v0.5.0/mod.ts`](https://deno.land/x/fastro@v0.5.0/mod.ts). If you do not use the version, it will refer to `master` branch.

Check [this folder](https://github.com/fastrojs/fastro-server/tree/master/examples) to find out how to: 
- [change default port & add optional listen callback](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L34)
- [send simple text & json data](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L5)
- [get url parameters](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L20)
- [get payload](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L300)
- [set custom http headers & status](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L9)
- [create simple REST API](https://github.com/fastrojs/fastro-server/blob/master/examples/crud_postgres.ts)
- [create `middleware`](https://github.com/fastrojs/fastro-server/blob/master/examples/use_middleware.ts#L6)
- [create simple jwt auth](https://github.com/fastrojs/fastro-server/blob/master/examples/simple_jwt_auth.ts)
- [create global & url middleware](https://github.com/fastrojs/fastro-server/blob/master/examples/middleware.ts)
- [create `decorator`](https://github.com/fastrojs/fastro-server/blob/master/examples/decorate.ts)
- [create `plugin`](https://github.com/fastrojs/fastro-server/blob/master/examples/plugin.ts)

## Benchmarks
If performance is important to you, here are the benchmark results:

| Framework | Version | Router? | Avg Req |
| :-- | :-- | :--: | --: |
| Abc | 1.0.0-rc8 | &#10003; | 1380.9 |
| Deno `http` | 1.0.2 | &#10007; | 2281.9 |
| Express | 4.17.1 | &#10003; | 1087.91 |
| Fastify | 2.14.1 | &#10003; | 2169 |
| **Fastro** | **0.5.1** | **&#10003;** | **1805**  |
| Node `http` | 14.3.0 | &#10007; | 2476.45 |
| Oak | 4.0.0 | &#10003; | 1255.3 |

Check this to see the detail method & results: [benchmarks](https://github.com/fastrojs/fastro-server/tree/master/benchmarks).

![ci](https://github.com/fastrojs/fastro-server/workflows/ci/badge.svg)

