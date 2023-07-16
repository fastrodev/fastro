---
title: "Internal benchmarks"
description: This is the final output of an internal benchmark run on localhost
image: https://fastro.dev/static/image.png
author: Fastro
date: Jul 16, 2023
---

![bench](/static/bench.png)

This is the final output of an internal benchmark run on a localhost. It consists of a simple application for [a specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA tool](https://github.com/hatoo/oha) within 10 seconds. The results are then sorted by the fastest.

You can find the benchmarks script on this page: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                       |   rps |    % |
| :------------------------------------------------------------------------------------------- | ----: | ---: |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                       | 61030 | 100% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)           | 51896 |  85% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)           | 50807 |  83% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts) | 50363 |  83% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)               | 47928 |  79% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)               | 47457 |  78% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                         | 46309 |  76% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                | 43764 |  72% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                | 43457 |  71% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)         | 20116 |  33% |
| [markdown](https://github.com/fastrodev/fastro/blob/main/examples/markdown.ts)               |  4222 |   7% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)       |  3783 |   6% |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)           |  2003 |   3% |