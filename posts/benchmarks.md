---
title: "Internal benchmarks"
description: This is the final output of an internal benchmark run on localhost
image: https://fastro.dev/static/image.png
author: Fastro
date: Jul 18, 2023
---

![bench](/static/bench.png)

This is the final output of an internal benchmark run on a localhost. It consists of a simple application for [a specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA tool](https://github.com/hatoo/oha) within 5 seconds. The results are then sorted by the fastest.

You can find the benchmarks script on this page: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                             |   rps |    % |
| :------------------------------------------------------------------------------------------------- | ----: | ---: |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                             | 68942 | 100% |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                             | 67090 |  97% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                 | 60271 |  87% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                 | 59807 |  87% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)             | 58734 |  85% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                     | 56037 |  81% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                     | 55883 |  81% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                      | 51098 |  74% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                      | 50521 |  73% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                               | 41000 |  59% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)       | 39065 |  57% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)               | 25991 |  38% |
| [middleware_deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/middleware_deno_kv.ts) |  5351 |   8% |
| [markdown](https://github.com/fastrodev/fastro/blob/main/examples/markdown.ts)                     |  4871 |   7% |