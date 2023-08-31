---
title: "Benchmarks"
description: This is the final output of an internal benchmark run in github action
image: https://fastro.dev/static/image.png
---

This is the final output of an internal benchmark run in [github action](https://github.com/fastrodev/fastro/actions) on `8/31/2023, 12:26:43 AM`. It consists of several simple applications for [specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 5 seconds. The results are then sorted by the fastest.

You can find the benchmark script in this code: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                               |   rps |    % | oha cmd                                                        |
| :--------------------------------------------------------------------------------------------------- | ----: | ---: | :------------------------------------------------------------- |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               | 64538 | 100% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [register](https://github.com/fastrodev/fastro/blob/main/examples/register.ts)                       | 60138 |  93% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 59113 |  92% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 59021 |  91% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 58178 |  90% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 57118 |  89% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 56097 |  87% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [record](https://github.com/fastrodev/fastro/blob/main/examples/record.ts)                           | 55728 |  86% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 55725 |  86% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                        | 54742 |  85% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [app_middleware](https://github.com/fastrodev/fastro/blob/main/examples/app_middleware.ts)           | 42778 |  66% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 29348 |  45% | `oha -j --no-tui -z 5s http://localhost:8000/hello`            |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                                 | 29132 |  45% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 28585 |  44% | `oha -j --no-tui -z 5s http://localhost:8000/agus?title=lead`  |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   | 22786 |  35% | `oha -j --no-tui -z 5s http://localhost:8000/static/post.css`  |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                         | 16142 |  25% | `oha -j --no-tui -z 5s http://localhost:8000/user?name=john`   |
| [route_middleware](https://github.com/fastrodev/fastro/blob/main/examples/route_middleware.ts)       | 15360 |  24% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                               |  4722 |   7% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     |  2169 |   3% | `oha -j --no-tui -z 5s http://localhost:8000/static/image.png` |