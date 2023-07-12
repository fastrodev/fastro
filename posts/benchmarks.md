---
title: "Internal benchmarks"
description: This is the final output of an internal benchmark run on a github action
image: https://fastro.dev/static/image.png
author: Yanu Widodo
date: Jul 12, 2023
---

## Benchmark script

This is the final output of an internal benchmark run on a github action. It consists of a simple application for [a specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA tool](https://github.com/hatoo/oha) within 10 seconds. The results are then sorted by the fastest.

You can find the benchmarks script on this page: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                       |   rps |    % |
| :------------------------------------------------------------------------------------------- | ----: | ---: |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                       | 65181 | 100% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)           | 59651 |  92% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)           | 58549 |  90% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts) | 56835 |  87% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)               | 56144 |  86% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)               | 55449 |  85% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                | 51374 |  79% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                | 50705 |  78% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                         | 11471 |  18% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)         | 10116 |  16% |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)           |  7973 |  12% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)       |  7469 |  11% |