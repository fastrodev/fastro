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
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                       | 66060 | 100% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)           | 58584 |  89% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)           | 58443 |  88% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts) | 55891 |  85% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)               | 55518 |  84% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)               | 55320 |  84% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                | 50348 |  76% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                | 49862 |  75% |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)           | 15654 |  24% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                         | 10316 |  16% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)         | 10006 |  15% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)       |  7944 |  12% |