---
title: "Internal benchmarks"
description: This is the final output of an internal benchmark run on localhost
image: https://fastro.dev/static/image.png
author: Fastro
date: Jul 22, 2023
---

![bench](/static/bench.png)

This is the final output of an internal benchmark run on a localhost. It consists of a simple application for [a specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA tool](https://github.com/hatoo/oha) within 5 seconds. The results are then sorted by the fastest.

You can find the benchmarks script on this page: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                               |   rps |    % |
| :--------------------------------------------------------------------------------------------------- | ----: | ---: |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               | 67381 | 100% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 59251 |  88% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 59010 |  88% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 56945 |  85% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 55982 |  83% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 55972 |  83% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 50382 |  75% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                                 | 49127 |  73% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                        | 48901 |  73% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 38133 |  57% |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 26156 |  39% |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   | 26111 |  39% |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                         | 18277 |  27% |
| [markdown_hook](https://github.com/fastrodev/fastro/blob/main/examples/markdown_hook.ts)             | 15409 |  23% |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     |  5866 |   9% |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                               |  5188 |   8% |