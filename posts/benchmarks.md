---
title: "Internal benchmarks"
description: This is the final output of an internal benchmark run on a github action
image: https://fastro.dev/static/image.png
author: Yanu Widodo
date: Jul 12, 2023
---

## Benchmark script

This is the final output of an internal benchmark run on a github action. It consists of a simple application for [a specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA tool](https://github.com/hatoo/oha) within 10 seconds. The results are then sorted by the fastest.

You can find the benchmarks script on this page: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                       |   rps |    % |
| :------------------------------------------------------------------------------------------- | ----: | ---: |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                       | 70965 | 100% |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)           | 60815 |  86% |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)           | 60692 |  86% |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)               | 57611 |  81% |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts) | 57541 |  81% |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)               | 56393 |  79% |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                | 52527 |  74% |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                | 52462 |  74% |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)         | 10191 |  14% |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                         |  9587 |  14% |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)       |  8840 |  12% |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)           |  7390 |  10% |