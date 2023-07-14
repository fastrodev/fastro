---
title: "Internal benchmarks"
description: This is the final output of an internal benchmark run on localhost
image: https://fastro.dev/static/image.png
author: Fastro
date: Jul 14, 2023
---

## Benchmark script

This is the final output of an internal benchmark run on a localhost. It consists of a simple application for [a specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA tool](https://github.com/hatoo/oha) within 10 seconds. The results are then sorted by the fastest.

You can find the benchmarks script on this page: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                       |   rps |    % |
| :------------------------------------------------------------------------------------------- | ----: | ---: |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                       | 55942 | 100% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)           | 49037 |  88% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts) | 48850 |  87% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)           | 48696 |  87% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)               | 46265 |  83% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)               | 45895 |  82% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                | 44197 |  79% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                | 43428 |  78% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                         | 27723 |  50% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)         | 14316 |  26% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)       |  9291 |  17% |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)           |  1166 |   2% |