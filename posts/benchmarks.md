---
title: "Internal benchmarks"
description: This is the final output of an internal benchmark run on a github action
image: https://fastro.dev/static/image.png
author: Yanu Widodo
date: Jul 11, 2023
---

## Benchmark script

This is the final output of an internal benchmark run on a github action. It consists of a simple application for a specific purpose. Each is then accessed by the OHA tool within 10 seconds. The results are then sorted by the fastest.

You can find the benchmarks script on this page: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                       |   rps |    % |
| :------------------------------------------------------------------------------------------- | ----: | ---: |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                       | 42197 | 100% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)           | 33449 |  79% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)               | 32962 |  78% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)           | 30468 |  72% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)               | 30068 |  71% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                | 29714 |  70% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts) | 28687 |  68% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                | 28353 |  67% |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)           |  9792 |  23% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)         |  7134 |  17% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)       |  5377 |  13% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                         |  5335 |  13% |