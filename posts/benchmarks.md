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
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                       | 57870 | 100% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts) | 48830 |  84% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)           | 47050 |  81% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)           | 46468 |  80% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)               | 45956 |  79% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)               | 45215 |  78% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                | 43425 |  75% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                | 42862 |  74% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                         | 17606 |  30% |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)           | 11165 |  19% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)         |  8606 |  15% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)       |  7673 |  13% |