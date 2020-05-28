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

Check [the following codes](https://github.com/fastrojs/fastro-server/tree/master/examples) to find out how to: 
- change default port 
- create `request` handler
- get url parameter
- get payload
- modify `header`
- modify default `request`
- make simple jwt auth
- make simple REST API
- create `middleware`
- create `decorator`
- create `plugin`

## Benchmarks
If performance is important to you, here are the benchmark results:

| Framework | Version | Router? | Avg Req |
| :-- | :-- | :--: | --: |
| Abc | 1.0.0-rc8 | &#10003; | 1128 |
| Deno `http` | latest | &#10007; | 2120.7 |
| Express | 4.17.1 | &#10003; | 494.5 |
| Fastify | 2.14.1 | &#10003; | 1386.5 |
| **Fastro** | **latest** | **&#10003;** | **1560.1**  |
| Node `http` | 14.3.0 | &#10007; | 2423.81 |
| Oak | 4.0.0 | &#10003; | 1051.41 |

Check this to see the detail method & results: [benchmarks](https://github.com/fastrojs/fastro-server/tree/master/benchmarks).

![ci](https://github.com/fastrojs/fastro-server/workflows/ci/badge.svg)

