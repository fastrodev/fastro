---
title: "Internal benchmarks"
description: This is the final output of an internal benchmark run on localhost
image: https://fastro.dev/static/image.png
author: Fastro
date: Jul 17, 2023
---

![bench](/static/bench.png)

This is the final output of an internal benchmark run on a localhost. It consists of a simple application for [a specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA tool](https://github.com/hatoo/oha) within 10 seconds. The results are then sorted by the fastest.

You can find the benchmarks script on this page: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                             |   rps |    % |
| :------------------------------------------------------------------------------------------------- | ----: | ---: |
| [middleware_deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/middleware_deno_kv.ts) | 70820 | 100% |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                             | 68500 |  97% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                               | 61399 |  87% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                 | 59607 |  84% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)             | 58148 |  82% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                 | 57805 |  82% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                     | 56380 |  80% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                     | 56121 |  79% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                      | 51750 |  73% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)       | 50515 |  71% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                      | 50141 |  71% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)               | 26266 |  37% |
| [markdown](https://github.com/fastrodev/fastro/blob/main/examples/markdown.ts)                     |  4981 |   7% |