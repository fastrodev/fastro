---
title: "Benchmarks"
description: This is the final output of an internal benchmark run in github action
image: https://fastro.dev/static/image.png
---

This is the final output of an internal benchmark run in [github action](https://github.com/fastrodev/fastro/actions) on `1/30/2024, 12:28:44 AM`. It consists of several simple applications for [specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 10s. The results are then sorted by the fastest.

You can find the benchmark script in this code: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                               |   rps |    % | oha cmd                                                            |
| :--------------------------------------------------------------------------------------------------- | ----: | ---: | :----------------------------------------------------------------- |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               | 55580 | 100% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 55556 | 100% | `oha -j --no-tui -z 10s http://localhost:8000/agus?title=lead`     |
| [group](https://github.com/fastrodev/fastro/blob/main/examples/group.ts)                             | 51136 |  92% | `oha -j --no-tui -z 10s http://localhost:8000/api/user`            |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 50735 |  91% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 50013 |  90% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 49810 |  90% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 49382 |  89% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 46931 |  84% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 46578 |  84% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [app_middleware](https://github.com/fastrodev/fastro/blob/main/examples/app_middleware.ts)           | 43306 |  78% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   | 28547 |  51% | `oha -j --no-tui -z 10s http://localhost:8000/static/tailwind.css` |
| [server_rendering](https://github.com/fastrodev/fastro/blob/main/examples/server_rendering.tsx)      | 28512 |  51% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                         | 19638 |  35% | `oha -j --no-tui -z 10s http://localhost:8000/user?name=john`      |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 18236 |  33% | `oha -j --no-tui -z 10s http://localhost:8000/blog/hello`          |
| [oauth](https://github.com/fastrodev/fastro/blob/main/examples/oauth.ts)                             |  7490 |  13% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [route_middleware](https://github.com/fastrodev/fastro/blob/main/examples/route_middleware.ts)       |  4373 |   8% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     |  2216 |   4% | `oha -j --no-tui -z 10s http://localhost:8000/static/favicon.ico`  |