---
title: "Benchmarks"
description: This is the final output of an internal benchmark run in github action
image: https://fastro.dev/static/image.png
---

This is the final output of an internal benchmark run in [github action](https://github.com/fastrodev/fastro/actions) on `1/28/2024, 8:08:05 AM`. It consists of several simple applications for [specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 60 seconds. The results are then sorted by the fastest.

You can find the benchmark script in this code: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                               |   rps |    % | oha cmd                                                           |
| :--------------------------------------------------------------------------------------------------- | ----: | ---: | :---------------------------------------------------------------- |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 58252 | 100% | `oha -j --no-tui -z 5s http://localhost:8000/agus?title=lead`     |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               | 55809 |  96% | `oha -j --no-tui -z 5s http://localhost:8000`                     |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 50934 |  87% | `oha -j --no-tui -z 5s http://localhost:8000`                     |
| [group](https://github.com/fastrodev/fastro/blob/main/examples/group.ts)                             | 50134 |  86% | `oha -j --no-tui -z 5s http://localhost:8000/api/user`            |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 49436 |  85% | `oha -j --no-tui -z 5s http://localhost:8000`                     |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 49212 |  84% | `oha -j --no-tui -z 5s http://localhost:8000`                     |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 49041 |  84% | `oha -j --no-tui -z 5s http://localhost:8000`                     |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 47544 |  82% | `oha -j --no-tui -z 5s http://localhost:8000`                     |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 46845 |  80% | `oha -j --no-tui -z 5s http://localhost:8000`                     |
| [app_middleware](https://github.com/fastrodev/fastro/blob/main/examples/app_middleware.ts)           | 42484 |  73% | `oha -j --no-tui -z 5s http://localhost:8000`                     |
| [server_rendering](https://github.com/fastrodev/fastro/blob/main/examples/server_rendering.tsx)      | 28484 |  49% | `oha -j --no-tui -z 5s http://localhost:8000`                     |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   | 28156 |  48% | `oha -j --no-tui -z 5s http://localhost:8000/static/tailwind.css` |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 25598 |  44% | `oha -j --no-tui -z 5s http://localhost:8000/blog/hello`          |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                         | 18855 |  32% | `oha -j --no-tui -z 5s http://localhost:8000/user?name=john`      |
| [oauth](https://github.com/fastrodev/fastro/blob/main/examples/oauth.ts)                             | 10592 |  18% | `oha -j --no-tui -z 5s http://localhost:8000`                     |
| [route_middleware](https://github.com/fastrodev/fastro/blob/main/examples/route_middleware.ts)       |  5252 |   9% | `oha -j --no-tui -z 5s http://localhost:8000`                     |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     |  3201 |   5% | `oha -j --no-tui -z 5s http://localhost:8000/static/favicon.ico`  |