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
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                             | 70544 | 100% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                 | 60650 |  86% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                 | 60208 |  85% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)       | 59172 |  84% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)             | 59107 |  84% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                     | 57694 |  82% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                     | 57062 |  81% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                               | 54490 |  77% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                      | 52003 |  74% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                      | 51049 |  72% |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                             | 42128 |  60% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)               | 26904 |  38% |
| [markdown](https://github.com/fastrodev/fastro/blob/main/examples/markdown.ts)                     | 18254 |  26% |
| [middleware_deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/middleware_deno_kv.ts) | 17683 |  25% |