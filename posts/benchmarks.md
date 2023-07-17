---
title: "Internal benchmarks"
description: This is the final output of an internal benchmark run on localhost
image: https://fastro.dev/static/image.png
author: Fastro
date: Jul 17, 2023
---

![bench](/static/bench.png)

This is the final output of an internal benchmark run on a localhost. It consists of a simple application for [a specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA tool](https://github.com/hatoo/oha) within 10 seconds. The results are then sorted by the fastest.

You can find the benchmarks script on this page: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                       |   rps |    % |
| :------------------------------------------------------------------------------------------- | ----: | ---: |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                       | 45333 | 100% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)           | 39727 |  88% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)               | 36789 |  81% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)       | 36377 |  80% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts) | 36159 |  80% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)           | 35767 |  79% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)               | 35651 |  79% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                | 32078 |  71% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                         | 32012 |  71% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                | 31838 |  70% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)         | 16182 |  36% |
| [markdown](https://github.com/fastrodev/fastro/blob/main/examples/markdown.ts)               |  2926 |   6% |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)           |  1421 |   3% |