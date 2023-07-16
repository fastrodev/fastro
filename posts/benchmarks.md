---
title: "Internal benchmarks"
description: This is the final output of an internal benchmark run on localhost
image: https://fastro.dev/static/image.png
author: Fastro
date: Jul 16, 2023
---

## Benchmark script

This is the final output of an internal benchmark run on a localhost. It consists of a simple application for [a specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA tool](https://github.com/hatoo/oha) within 10 seconds. The results are then sorted by the fastest.

You can find the benchmarks script on this page: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                       |   rps |    % |
| :------------------------------------------------------------------------------------------- | ----: | ---: |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                       | 58691 | 100% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)           | 49045 |  84% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)           | 47959 |  82% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)               | 46833 |  80% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)               | 46498 |  79% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                         | 46222 |  79% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts) | 46193 |  79% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                | 41795 |  71% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                | 39993 |  68% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)         | 18906 |  32% |
| [markdown](https://github.com/fastrodev/fastro/blob/main/examples/markdown.ts)               |  4189 |   7% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)       |  4114 |   7% |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)           |  2379 |   4% |