---
title: "Internal benchmarks"
description: This is the final output of an internal benchmark run on localhost
image: https://fastro.dev/static/image.png
author: Fastro
date: Jul 20, 2023
---

![bench](/static/bench.png)

This is the final output of an internal benchmark run on a localhost. It consists of a simple application for [a specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA tool](https://github.com/hatoo/oha) within 5 seconds. The results are then sorted by the fastest.

You can find the benchmarks script on this page: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                               |   rps |    % |
| :--------------------------------------------------------------------------------------------------- | ----: | ---: |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               | 66895 | 100% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 58260 |  87% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 58253 |  87% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 55087 |  82% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 55081 |  82% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 54765 |  82% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 54066 |  81% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                        | 50967 |  76% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 50134 |  75% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                                 | 46426 |  69% |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   | 26259 |  39% |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 25359 |  38% |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                         | 18190 |  27% |
| [markdown_hook](https://github.com/fastrodev/fastro/blob/main/examples/markdown_hook.ts)             | 13470 |  20% |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     |  4881 |   7% |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                               |  4838 |   7% |