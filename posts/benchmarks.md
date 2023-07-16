---
title: "Internal benchmarks"
description: This is the final output of an internal benchmark run on localhost
image: https://fastro.dev/static/image.png
author: Fastro
date: Jul 16, 2023
---

## Benchmark script

This is the final output of an internal benchmark run on a localhost. It consists of a simple application for [a specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA tool](https://github.com/hatoo/oha) within 10 seconds. The results are then sorted by the fastest.

You can find the benchmarks script on this page: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                       |   rps |    % |
| :------------------------------------------------------------------------------------------- | ----: | ---: |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                       | 67727 | 100% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)           | 58520 |  86% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)           | 57830 |  85% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts) | 57030 |  84% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)               | 56014 |  83% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)               | 55186 |  81% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                         | 53868 |  80% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                | 51277 |  76% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                | 50734 |  75% |
| [markdown](https://github.com/fastrodev/fastro/blob/main/examples/markdown.ts)               | 13801 |  20% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)         |  9941 |  15% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)       |  7141 |  11% |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)           |  6590 |  10% |