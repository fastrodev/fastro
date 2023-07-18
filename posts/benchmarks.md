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
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                             | 53630 | 100% |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                             | 50715 |  95% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                 | 47384 |  88% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)       | 47375 |  88% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                 | 47134 |  88% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)             | 46041 |  86% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                     | 44497 |  83% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                     | 44362 |  83% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                      | 42093 |  78% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                      | 40514 |  76% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)               | 24456 |  46% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                               | 23830 |  44% |
| [middleware_deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/middleware_deno_kv.ts) |  8634 |  16% |
| [markdown](https://github.com/fastrodev/fastro/blob/main/examples/markdown.ts)                     |  7354 |  14% |