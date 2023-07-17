---
title: "Internal benchmarks"
description: This is the final output of an internal benchmark run on localhost
image: https://fastro.dev/static/image.png
author: Fastro
date: Jul 17, 2023
---

![bench](/static/bench.png)

This is the final output of an internal benchmark run on a localhost. It consists of a simple application for [a specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA tool](https://github.com/hatoo/oha) within 10 seconds. The results are then sorted by the fastest.

You can find the benchmarks script on this page: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                       |   rps |    % |
| :------------------------------------------------------------------------------------------- | ----: | ---: |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                       | 40367 | 100% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)           | 33460 |  83% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)               | 33457 |  83% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)       | 33188 |  82% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)               | 32866 |  81% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)           | 32332 |  80% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts) | 32173 |  80% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                         | 29834 |  74% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                | 29733 |  74% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                | 29214 |  72% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)         | 15019 |  37% |
| [markdown](https://github.com/fastrodev/fastro/blob/main/examples/markdown.ts)               |  3124 |   8% |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)           |  1200 |   3% |