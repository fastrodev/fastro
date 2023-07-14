---
title: "Internal benchmarks"
description: This is the final output of an internal benchmark run on localhost
image: https://fastro.dev/static/image.png
author: Yanu Widodo
date: Jul 14, 2023
---

## Benchmark script

This is the final output of an internal benchmark run on a localhost. It consists of a simple application for [a specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA tool](https://github.com/hatoo/oha) within 10 seconds. The results are then sorted by the fastest.

You can find the benchmarks script on this page: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                       |   rps |    % |
| :------------------------------------------------------------------------------------------- | ----: | ---: |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                       | 53836 | 100% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)           | 48633 |  90% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)           | 47656 |  89% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts) | 44760 |  83% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)               | 44114 |  82% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                | 43532 |  81% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                | 41538 |  77% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)               | 41511 |  77% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                         | 24230 |  45% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)       | 12064 |  22% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)         | 11149 |  21% |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)           |  8410 |  16% |