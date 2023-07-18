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
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                             | 46654 | 100% |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                             | 40342 |  86% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                 | 36347 |  78% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                     | 36236 |  78% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)       | 36189 |  78% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)             | 35545 |  76% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                     | 34822 |  75% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                 | 33041 |  71% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                      | 32032 |  69% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                               | 23244 |  50% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                      | 18769 |  40% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)               | 17043 |  37% |
| [markdown](https://github.com/fastrodev/fastro/blob/main/examples/markdown.ts)                     | 11856 |  25% |
| [middleware_deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/middleware_deno_kv.ts) |  2938 |   6% |