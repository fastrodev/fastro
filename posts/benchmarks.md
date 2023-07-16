---
title: "Internal benchmarks"
description: This is the final output of an internal benchmark run on localhost
image: https://fastro.dev/static/image.png
author: Fastro
date: Jul 16, 2023
---

## Benchmark script

This is the final output of an internal benchmark run on a localhost. It consists of a simple application for [a specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA tool](https://github.com/hatoo/oha) within 10 seconds. The results are then sorted by the fastest.

You can find the benchmarks script on this page: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                       |   rps |    % |
| :------------------------------------------------------------------------------------------- | ----: | ---: |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                       | 64499 | 100% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)           | 56642 |  88% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)           | 54371 |  84% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                         | 53534 |  83% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)               | 53254 |  83% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)               | 52057 |  81% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                | 48385 |  75% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                | 46536 |  72% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts) | 44398 |  69% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)         | 22071 |  34% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)       |  4700 |   7% |
| [markdown](https://github.com/fastrodev/fastro/blob/main/examples/markdown.ts)               |  4688 |   7% |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)           |  2500 |   4% |