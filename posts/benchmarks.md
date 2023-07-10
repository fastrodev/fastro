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
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                       | 67967 | 100% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)           | 59810 |  88% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)           | 58739 |  86% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts) | 58042 |  85% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)               | 56881 |  84% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)               | 56102 |  83% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                | 51273 |  75% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                | 50756 |  75% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                         | 21738 |  32% |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)           | 15371 |  23% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)         |  9984 |  15% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)       |  7397 |  11% |