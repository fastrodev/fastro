---
title: "Benchmarks"
description: This is the final output of an internal benchmark run in github action
image: https://fastro.dev/static/image.png
---

This is the final output of an internal benchmark run in [github action](https://github.com/fastrodev/fastro/actions) on `1/27/2024, 4:25:09 PM`. It consists of several simple applications for [specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 30 seconds. The results are then sorted by the fastest.

You can find the benchmark script in this code: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                               |   rps |    % | oha cmd                                                           |
| :--------------------------------------------------------------------------------------------------- | ----: | ---: | :---------------------------------------------------------------- |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 57246 | 100% | `oha -j --no-tui -z 2s http://localhost:8000/agus?title=lead`     |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 38580 |  67% | `oha -j --no-tui -z 2s http://localhost:8000`                     |
| [group](https://github.com/fastrodev/fastro/blob/main/examples/group.ts)                             | 38278 |  67% | `oha -j --no-tui -z 2s http://localhost:8000`                     |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               | 37618 |  66% | `oha -j --no-tui -z 2s http://localhost:8000`                     |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 35758 |  62% | `oha -j --no-tui -z 2s http://localhost:8000`                     |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 32503 |  57% | `oha -j --no-tui -z 2s http://localhost:8000`                     |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 31204 |  55% | `oha -j --no-tui -z 2s http://localhost:8000`                     |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 30821 |  54% | `oha -j --no-tui -z 2s http://localhost:8000`                     |
| [app_middleware](https://github.com/fastrodev/fastro/blob/main/examples/app_middleware.ts)           | 30585 |  53% | `oha -j --no-tui -z 2s http://localhost:8000`                     |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 26018 |  45% | `oha -j --no-tui -z 2s http://localhost:8000`                     |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 25576 |  45% | `oha -j --no-tui -z 2s http://localhost:8000/blog/hello`          |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   | 19390 |  34% | `oha -j --no-tui -z 2s http://localhost:8000/static/tailwind.css` |
| [oauth](https://github.com/fastrodev/fastro/blob/main/examples/oauth.ts)                             | 10017 |  17% | `oha -j --no-tui -z 2s http://localhost:8000`                     |
| [route_middleware](https://github.com/fastrodev/fastro/blob/main/examples/route_middleware.ts)       |  8004 |  14% | `oha -j --no-tui -z 2s http://localhost:8000`                     |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     |  7818 |  14% | `oha -j --no-tui -z 2s http://localhost:8000/static/favicon.ico`  |