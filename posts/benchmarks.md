---
title: "Internal benchmarks"
description: This is the final output of an internal benchmark run on a github action
image: https://fastro.dev/static/image.png
author: Yanu Widodo
date: Jul 10, 2023
---

## Benchmark script

This is the final output of an internal benchmark run on a github action. It consists of a simple application for a specific purpose. Each is then accessed by the OHA tool within 10 seconds. The results are then sorted by the fastest.

You can find the benchmarks script on this page: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                       |   rps |    % |
| :------------------------------------------------------------------------------------------- | ----: | ---: |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                       | 55649 | 100% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)           | 45008 |  81% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)           | 44088 |  79% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)               | 43939 |  79% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts) | 43770 |  79% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)               | 42060 |  76% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                | 39793 |  72% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                | 38324 |  69% |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)           | 12678 |  23% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)         |  9395 |  17% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                         |  9092 |  16% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)       |  6407 |  12% |