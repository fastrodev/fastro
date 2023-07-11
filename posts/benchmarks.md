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
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                       | 41698 | 100% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)           | 35207 |  84% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)           | 33653 |  81% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts) | 33476 |  80% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)               | 33268 |  80% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)               | 30881 |  74% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                | 29544 |  71% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                | 28789 |  69% |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)           |  8610 |  21% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)         |  7668 |  18% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                         |  7139 |  17% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)       |  6734 |  16% |