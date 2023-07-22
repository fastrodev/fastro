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
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               | 64425 | 100% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 54417 |  84% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 52727 |  82% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 52429 |  81% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 51004 |  79% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 50568 |  78% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 50145 |  78% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                        | 45206 |  70% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 45180 |  70% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                                 | 33039 |  51% |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   | 22089 |  34% |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 20716 |  32% |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                         | 16346 |  25% |
| [markdown_hook](https://github.com/fastrodev/fastro/blob/main/examples/markdown_hook.ts)             | 12591 |  20% |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                               |  5543 |   9% |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     |  4835 |   8% |