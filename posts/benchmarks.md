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
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                       | 67133 | 100% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                         | 54974 |  82% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)           | 54669 |  81% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)           | 54132 |  81% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts) | 51727 |  77% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)               | 51373 |  77% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)               | 48806 |  73% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                | 46475 |  69% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                | 44817 |  67% |
| [markdown](https://github.com/fastrodev/fastro/blob/main/examples/markdown.ts)               | 11263 |  17% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)         |  9675 |  14% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)       |  7255 |  11% |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)           |  6472 |  10% |