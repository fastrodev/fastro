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
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                             | 69242 | 100% |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                             | 62614 |  90% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                 | 61069 |  88% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)       | 59653 |  86% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                 | 58264 |  84% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)             | 58080 |  84% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                     | 56685 |  82% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                     | 55807 |  81% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                      | 50666 |  73% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                      | 50475 |  73% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                               | 39681 |  57% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)               | 26609 |  38% |
| [markdown](https://github.com/fastrodev/fastro/blob/main/examples/markdown.ts)                     | 19644 |  28% |
| [middleware_deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/middleware_deno_kv.ts) |  4840 |   7% |