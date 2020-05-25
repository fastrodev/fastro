![ci](https://github.com/fastrojs/fastro-server/workflows/ci/badge.svg)
# Fastro
Fast, simple, minimalist web framework for [Deno](https://deno.land/). 

Inspired by [Fastify](https://www.fastify.io/) & [Express](https://expressjs.com/).

```ts
import { Fastro } from "https://deno.land/x/fastro/mod.ts";

const server = new Fastro();

server.get("/", (req) => req.send("root"));

await server.listen();

```

## How to use & examples

This module uses git release. If you want to use a particular release, for example v0.0.1, then the complete url is [https://deno.land/x/fastro@v0.1.0/mod.ts](https://deno.land/x/fastro@v0.1.0/mod.ts). If you do not use the version, it will refer to latest version (master branch).
Check the following codes to find out how to: changing the default port, modify the header, modify default `request`, or adding plugins: [examples](https://github.com/fastrojs/fastro-server/tree/master/examples).

## Benchmarks
If performance is important to you, here are the benchmark results:

| Framework | Version | Router? | Avg Req |
| :-- | :-- | :--: | --: |
| Abc | 1.0.0-rc8 | &#10003; | 933.9 |
| Deno `http` | latest | &#10007; | 2294.81 |
| Express | 4.17.1 | &#10003; | 445.1 |
| Fastify | 2.14.1 | &#10003; | 1242.2 |
| **Fastro** | **latest** | **&#10003;** | **1449.8**  |
| Node `http` | 14.3.0 | &#10007; | 1746.7 |
| Oak | 4.0.0 | &#10003; | 945.7 |

Check this to see the detail method & results: [benchmarks](https://github.com/fastrojs/fastro-server/tree/master/benchmarks).

