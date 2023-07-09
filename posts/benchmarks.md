---
title: "Internal benchmarks"
description: This is the final output of an internal benchmark run on a github action
image: https://fastro.dev/static/image.png
author: Yanu Widodo
date: Jul 9, 2023
---

## Benchmark script

This is the final output of an internal benchmark run on a github action. 
You can find the benchmarks script on this page: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                       |   rps |    % |
| :------------------------------------------------------------------------------------------- | ----: | ---: |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                       | 52831 | 100% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)           | 46917 |  89% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)           | 45105 |  85% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)               | 44019 |  83% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)               | 42445 |  80% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts) | 42063 |  80% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                | 41846 |  79% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                | 41199 |  78% |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)           | 11640 |  22% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)         |  9557 |  18% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)       |  7099 |  13% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                         |  6708 |  13% |