---
title: "Benchmarks"
description: This is the final output of an internal benchmark run in github action
image: https://fastro.dev/static/image.png
---

This is the final output of an internal benchmark run in [github action](https://github.com/fastrodev/fastro/actions) on `8/29/2023, 6:09:20 AM`. It consists of several simple applications for [specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 5 seconds. The results are then sorted by the fastest.

You can find the benchmark script in this code: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                               |   rps |    % | oha cmd                                                        |
| :--------------------------------------------------------------------------------------------------- | ----: | ---: | :------------------------------------------------------------- |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               | 69235 | 100% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [register](https://github.com/fastrodev/fastro/blob/main/examples/register.ts)                       | 66377 |  96% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 65730 |  95% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 65311 |  94% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 64508 |  93% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                        | 62639 |  90% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 62569 |  90% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 62483 |  90% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 62127 |  90% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [record](https://github.com/fastrodev/fastro/blob/main/examples/record.ts)                           | 61728 |  89% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [app_middleware](https://github.com/fastrodev/fastro/blob/main/examples/app_middleware.ts)           | 59638 |  86% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 55998 |  81% | `oha -j --no-tui -z 5s http://localhost:8000/hello`            |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                                 | 42147 |  61% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 41368 |  60% | `oha -j --no-tui -z 5s http://localhost:8000/agus?title=lead`  |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   | 26729 |  39% | `oha -j --no-tui -z 5s http://localhost:8000/static/post.css`  |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                         | 19515 |  28% | `oha -j --no-tui -z 5s http://localhost:8000/user?name=john`   |
| [route_middleware](https://github.com/fastrodev/fastro/blob/main/examples/route_middleware.ts)       | 16955 |  24% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                               |  5074 |   7% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     |  2146 |   3% | `oha -j --no-tui -z 5s http://localhost:8000/static/image.png` |