---
title: "Internal benchmarks"
description: This is the final output of an internal benchmark run on localhost
image: https://fastro.dev/static/bench.png
author: Fastro
date: Jul 15, 2023
---

![bench](/static/bench.png)

## Benchmark script

This is the final output of an internal benchmark run on a localhost. It consists of a simple application for [a specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA tool](https://github.com/hatoo/oha) within 10 seconds. The results are then sorted by the fastest.

You can find the benchmarks script on this page: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                       |   rps |    % |
| :------------------------------------------------------------------------------------------- | ----: | ---: |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                       | 54551 | 100% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)           | 49012 |  90% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts) | 48678 |  89% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)           | 48290 |  89% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)               | 46546 |  85% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)               | 45972 |  84% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                | 43909 |  80% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                | 42997 |  79% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                         | 27662 |  51% |
| [markdown](https://github.com/fastrodev/fastro/blob/main/examples/markdown.ts)               | 18042 |  33% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)         | 14302 |  26% |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)           | 11259 |  21% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)       |  9214 |  17% |