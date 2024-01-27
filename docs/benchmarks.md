---
title: "Benchmarks"
description: This is the final output of an internal benchmark run in github action
image: https://fastro.dev/static/image.png
---

This is the final output of an internal benchmark run on
[github action](https://github.com/fastrodev/fastro/actions) on
`1/28/2024, 3:34:22 AM`. It consists of several simple applications for
[specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json).
Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 5
seconds. The results are then sorted by the fastest.

You can find the benchmark script in this code:
[run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results

| module                                                                                               |   rps |    % | oha cmd                                                            |
| :--------------------------------------------------------------------------------------------------- | ----: | ---: | :----------------------------------------------------------------- |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 56970 | 100% | `oha -j --no-tui -z 10s http://localhost:8000/agus?title=lead`     |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               | 56391 |  99% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 51576 |  91% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 51284 |  90% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [group](https://github.com/fastrodev/fastro/blob/main/examples/group.ts)                             | 50434 |  89% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 50418 |  88% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 50056 |  88% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 47429 |  83% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 46904 |  82% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [app_middleware](https://github.com/fastrodev/fastro/blob/main/examples/app_middleware.ts)           | 44069 |  77% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   | 28688 |  50% | `oha -j --no-tui -z 10s http://localhost:8000/static/tailwind.css` |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 21817 |  38% | `oha -j --no-tui -z 10s http://localhost:8000/blog/hello`          |
| [oauth](https://github.com/fastrodev/fastro/blob/main/examples/oauth.ts)                             |  7226 |  13% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [route_middleware](https://github.com/fastrodev/fastro/blob/main/examples/route_middleware.ts)       |  4574 |   8% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     |  2163 |   4% | `oha -j --no-tui -z 10s http://localhost:8000/static/favicon.ico`  |
