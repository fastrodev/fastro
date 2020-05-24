![ci](https://github.com/fastrojs/fastro-server/workflows/ci/badge.svg)
# Fastro
Fast, simple, minimalist web framework for [Deno](https://deno.land/). 

Inspired by [Fastify](https://www.fastify.io/) & [Express](https://expressjs.com/).

```ts
import { Fastro } from "https://deno.land/x/fastro/mod.ts";

const server = new Fastro();

server.get("/", (req) => req.send("root"));

await server.listen({ port: 8000 });

```

For other details, you can see in: [examples](https://github.com/fastrojs/fastro-server/tree/master/examples).

## Benchmarks
If performance is important to you, here are the benchmark results:

| Framework | Version | Router? | Avg Req |
| :-- | :-- | :--: | --: |
| Abc | 1.0.0-rc8 | &#10003; | 983 |
| Deno `http` | latest | &#10007; | 2204.2 |
| Express | 4.17.1 | &#10003; | 494.3 |
| Fastify | 2.14.1 | &#10003; | 1402.7 |
| **Fastro** | **latest** | **&#10003;** | **1462.5**  |
| Node `http` | 14.3.0 | &#10007; | 1978.9 |
| Oak | 4.0.0 | &#10003; | 987.8 |

Check this to see the detail method & results: [benckmarks](https://github.com/fastrojs/fastro-server/tree/master/benchmarks)

