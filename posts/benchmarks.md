---
title: "Internal benchmarks"
description: This is the final output of an internal benchmark run on a github action
image: https://fastro.dev/static/image.png
author: Yanu Widodo
date: Jul 9, 2023
---

## Benchmark script

This is the final output of an internal benchmark run on a github action. It consists of a simple application for a specific purpose. Each is then accessed by the OHA tool within 10 seconds. The results are then sorted by the fastest.

You can find the benchmarks script on this page: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                       |   rps |    % |
| :------------------------------------------------------------------------------------------- | ----: | ---: |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                       | 50984 | 100% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)           | 43723 |  86% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)           | 43619 |  86% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts) | 43047 |  84% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                | 42072 |  83% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)               | 41324 |  81% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)               | 39360 |  77% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                | 39326 |  77% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                         | 17190 |  34% |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)           | 11323 |  22% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)         |  7944 |  16% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)       |  6972 |  14% |