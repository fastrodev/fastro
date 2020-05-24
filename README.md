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

## Examples
Other ways of using it include changing the default port, modify the header, modify default `request`, or adding plugins -- you can see in: [examples](https://github.com/fastrojs/fastro-server/tree/master/examples).

## Benchmarks
If performance is important to you, here are the benchmark results:

| Framework | Version | Router? | Avg Req |
| :-- | :-- | :--: | --: |
| Abc | 1.0.0-rc8 | &#10003; | 1372.1 |
| Deno `http` | latest | &#10007; | 2487.81 |
| Express | 4.17.1 | &#10003; | 517.3 |
| Fastify | 2.14.1 | &#10003; | 1175.5 |
| **Fastro** | **latest** | **&#10003;** | **1584**  |
| Node `http` | 14.3.0 | &#10007; | 2219.1 |
| Oak | 4.0.0 | &#10003; | 1136.6 |

Check this to see the detail method & results: [benckmarks](https://github.com/fastrojs/fastro-server/tree/master/benchmarks)

