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
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                             | 53203 | 100% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                 | 45618 |  86% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)       | 44836 |  84% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                 | 43911 |  83% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                     | 43195 |  81% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)             | 43043 |  81% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                     | 42492 |  80% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                      | 38756 |  73% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                      | 35718 |  67% |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                             | 34791 |  65% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                               | 23975 |  45% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)               | 19604 |  37% |
| [markdown](https://github.com/fastrodev/fastro/blob/main/examples/markdown.ts)                     |  3673 |   7% |
| [middleware_deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/middleware_deno_kv.ts) |  2600 |   5% |