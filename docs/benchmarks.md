---
title: Benchmarks
description: This is the final output of an internal benchmark run in github action
image: https://fastro.dev/fastro.png
---

This is the final output of an internal benchmark run in [github action](https://github.com/fastrodev/fastro/actions) on `9/21/2024, 10:27:37 PM`. It consists of several simple applications for [specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 10s. The results are then sorted by the fastest.

You can find the benchmark script in this code: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                               |   rps |    % | oha cmd                                                            |
| :--------------------------------------------------------------------------------------------------- | ----: | ---: | :----------------------------------------------------------------- |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                         | 69054 | 100% | `oha -j --no-tui -z 10s http://localhost:8000/user?name=john`      |
| [group](https://github.com/fastrodev/fastro/blob/main/examples/group.ts)                             | 68976 | 100% | `oha -j --no-tui -z 10s http://localhost:8000/api/user`            |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 68946 | 100% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_sqlite](https://github.com/fastrodev/fastro/blob/main/examples/deno_sqlite.ts)                 | 68875 | 100% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 68856 | 100% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     | 68848 | 100% | `oha -j --no-tui -z 10s http://localhost:8000/static/favicon.ico`  |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 68749 | 100% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   | 68562 |  99% | `oha -j --no-tui -z 10s http://localhost:8000/static/tailwind.css` |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 68537 |  99% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [app_middleware](https://github.com/fastrodev/fastro/blob/main/examples/app_middleware.ts)           | 68454 |  99% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 68293 |  99% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [server_rendering](https://github.com/fastrodev/fastro/blob/main/examples/server_rendering.tsx)      | 68183 |  99% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_postgres](https://github.com/fastrodev/fastro/blob/main/examples/deno_postgres.ts)             | 68135 |  99% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 68115 |  99% | `oha -j --no-tui -z 10s http://localhost:8000/blog/hello`          |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 68020 |  99% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_redis](https://github.com/fastrodev/fastro/blob/main/examples/deno_redis.ts)                   | 68009 |  98% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 67933 |  98% | `oha -j --no-tui -z 10s http://localhost:8000/agus?title=lead`     |
| [deno_mysql](https://github.com/fastrodev/fastro/blob/main/examples/deno_mysql.ts)                   | 67612 |  98% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_mongo](https://github.com/fastrodev/fastro/blob/main/examples/deno_mongo.ts)                   | 67582 |  98% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [oauth](https://github.com/fastrodev/fastro/blob/main/examples/oauth.ts)                             | 67529 |  98% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [route_middleware](https://github.com/fastrodev/fastro/blob/main/examples/route_middleware.ts)       | 60566 |  88% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               | 59638 |  86% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [store](https://github.com/fastrodev/fastro/blob/main/examples/store.ts)                             | 51429 |  74% | `oha -j --no-tui -z 10s http://localhost:8000`                     |