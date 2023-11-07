---
title: "Benchmarks"
description: This is the final output of an internal benchmark run in github action
image: https://fastro.dev/static/image.png
---

This is the final output of an internal benchmark run in [github action](https://github.com/fastrodev/fastro/actions) on `11/7/2023, 12:11:36 PM`. It consists of several simple applications for [specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 5 seconds. The results are then sorted by the fastest.

You can find the benchmark script in this code: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                               |   rps |    % | oha cmd                                                        |
| :--------------------------------------------------------------------------------------------------- | ----: | ---: | :------------------------------------------------------------- |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 80079 | 100% | `oha -j --no-tui -z 5s http://localhost:8000/hello`            |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 50374 |  63% | `oha -j --no-tui -z 5s http://localhost:8000/agus?title=lead`  |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 48897 |  61% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 48565 |  61% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [register](https://github.com/fastrodev/fastro/blob/main/examples/register.ts)                       | 48163 |  60% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 47544 |  59% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 44685 |  56% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [record](https://github.com/fastrodev/fastro/blob/main/examples/record.ts)                           | 44400 |  55% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 44260 |  55% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [app_middleware](https://github.com/fastrodev/fastro/blob/main/examples/app_middleware.ts)           | 39555 |  49% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                                 | 33094 |  41% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   | 25343 |  32% | `oha -j --no-tui -z 5s http://localhost:8000/static/post.css`  |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                        | 25036 |  31% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 20734 |  26% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [route_middleware](https://github.com/fastrodev/fastro/blob/main/examples/route_middleware.ts)       | 16484 |  21% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                         | 13471 |  17% | `oha -j --no-tui -z 5s http://localhost:8000/user?name=john`   |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                               |  4092 |   5% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     |  3415 |   4% | `oha -j --no-tui -z 5s http://localhost:8000/static/image.png` |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               |  1138 |   1% | `oha -j --no-tui -z 5s http://localhost:8000`                  |