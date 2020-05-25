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
| Abc | ${abc_version} | &#10003; | ${abc} |
| Deno `http` | ${deno_version} | &#10007; | ${deno_http} |
| Express | ${express_version} | &#10003; | ${express} |
| Fastify | ${fastify_version} | &#10003; | ${fastify} |
| **Fastro** | **${fastro_version}** | **&#10003;** | **${fastro}**  |
| Node `http` | ${node_version} | &#10007; | ${node} |
| Oak | ${oak_version} | &#10003; | ${oak} |

Check this to see the detail method & results: [benchmarks](https://github.com/fastrojs/fastro-server/tree/master/benchmarks)

