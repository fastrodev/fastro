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
| Abc | 1.0.0-rc8 | &#10003; | 1047.8 |
| Deno `http` | latest | &#10007; | 2175.31 |
| Express | 4.17.1 | &#10003; | 527.1 |
| Fastify | 2.14.1 | &#10003; | 1540.8 |
| **Fastro** | **latest** | **&#10003;** | **1668**  |
| Node `http` | 14.3.0 | &#10007; | 2504.4 |
| Oak | 4.0.0 | &#10003; | 1088.3 |

Check this to see the detail method & results: [benckmarks](https://github.com/fastrojs/fastro-server/tree/master/benchmarks)

