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
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                             | 66130 | 100% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                 | 54629 |  83% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)       | 54587 |  83% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)             | 52701 |  80% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                     | 51449 |  78% |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                             | 51372 |  78% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                     | 50630 |  77% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                               | 47444 |  72% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                      | 46143 |  70% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                      | 45732 |  69% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                 | 40439 |  61% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)               | 22858 |  35% |
| [markdown](https://github.com/fastrodev/fastro/blob/main/examples/markdown.ts)                     | 15564 |  24% |
| [middleware_deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/middleware_deno_kv.ts) |  4140 |   6% |