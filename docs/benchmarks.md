---
title: "Benchmarks"
description: This is the final output of an internal benchmark run in github action
image: https://fastro.dev/static/image.png
---

This is the final output of an internal benchmark run in [github action](https://github.com/fastrodev/fastro/actions) on `1/27/2024, 7:38:57 PM`. It consists of several simple applications for [specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 60 seconds. The results are then sorted by the fastest.

You can find the benchmark script in this code: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                               |   rps |    % | oha cmd                                                           |
| :--------------------------------------------------------------------------------------------------- | ----: | ---: | :---------------------------------------------------------------- |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 36770 | 100% | `oha -j --no-tui -z 5s http://localhost:8000`                     |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 35706 |  97% | `oha -j --no-tui -z 5s http://localhost:8000`                     |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               | 31209 |  85% | `oha -j --no-tui -z 5s http://localhost:8000`                     |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 30590 |  83% | `oha -j --no-tui -z 5s http://localhost:8000`                     |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 27823 |  76% | `oha -j --no-tui -z 5s http://localhost:8000`                     |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 27568 |  75% | `oha -j --no-tui -z 5s http://localhost:8000`                     |
| [app_middleware](https://github.com/fastrodev/fastro/blob/main/examples/app_middleware.ts)           | 26928 |  73% | `oha -j --no-tui -z 5s http://localhost:8000`                     |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 25863 |  70% | `oha -j --no-tui -z 5s http://localhost:8000`                     |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 25856 |  70% | `oha -j --no-tui -z 5s http://localhost:8000/agus?title=lead`     |
| [group](https://github.com/fastrodev/fastro/blob/main/examples/group.ts)                             | 21421 |  58% | `oha -j --no-tui -z 5s http://localhost:8000/api/user`            |
| [server_rendering](https://github.com/fastrodev/fastro/blob/main/examples/server_rendering.tsx)      | 14290 |  39% | `oha -j --no-tui -z 5s http://localhost:8000`                     |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   | 14186 |  39% | `oha -j --no-tui -z 5s http://localhost:8000/static/tailwind.css` |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 13975 |  38% | `oha -j --no-tui -z 5s http://localhost:8000/blog/hello`          |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                         |  7709 |  21% | `oha -j --no-tui -z 5s http://localhost:8000/user?name=john`      |
| [oauth](https://github.com/fastrodev/fastro/blob/main/examples/oauth.ts)                             |  4719 |  13% | `oha -j --no-tui -z 5s http://localhost:8000`                     |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     |  3877 |  11% | `oha -j --no-tui -z 5s http://localhost:8000/static/favicon.ico`  |
| [route_middleware](https://github.com/fastrodev/fastro/blob/main/examples/route_middleware.ts)       |  3811 |  10% | `oha -j --no-tui -z 5s http://localhost:8000`                     |