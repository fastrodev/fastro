---
title: Benchmarks
description: This is the final output of an internal benchmark run in github action
image: https://fastro.dev/fastro.png
---

This is the final output of an internal benchmark run in [github action](https://github.com/fastrodev/fastro/actions) on `7/28/2024, 8:30:07 AM`. It consists of several simple applications for [specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 10s. The results are then sorted by the fastest.

You can find the benchmark script in this code: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                               |   rps |    % | oha cmd                                                            |
| :--------------------------------------------------------------------------------------------------- | ----: | ---: | :----------------------------------------------------------------- |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               | 56550 | 100% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 49796 |  88% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 49555 |  88% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [group](https://github.com/fastrodev/fastro/blob/main/examples/group.ts)                             | 48815 |  86% | `oha -j --no-tui -z 10s http://localhost:8000/api/user`            |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 48246 |  85% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 47892 |  85% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 47207 |  83% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 46722 |  83% | `oha -j --no-tui -z 10s http://localhost:8000/agus?title=lead`     |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 44609 |  79% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [app_middleware](https://github.com/fastrodev/fastro/blob/main/examples/app_middleware.ts)           | 41435 |  73% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_sqlite](https://github.com/fastrodev/fastro/blob/main/examples/deno_sqlite.ts)                 | 32571 |  58% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [server_rendering](https://github.com/fastrodev/fastro/blob/main/examples/server_rendering.tsx)      | 23367 |  41% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                         | 19538 |  35% | `oha -j --no-tui -z 10s http://localhost:8000/user?name=john`      |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 16181 |  29% | `oha -j --no-tui -z 10s http://localhost:8000/blog/hello`          |
| [deno_mysql](https://github.com/fastrodev/fastro/blob/main/examples/deno_mysql.ts)                   | 12967 |  23% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_mongo](https://github.com/fastrodev/fastro/blob/main/examples/deno_mongo.ts)                   | 11620 |  21% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_redis](https://github.com/fastrodev/fastro/blob/main/examples/deno_redis.ts)                   |  9213 |  16% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_postgres](https://github.com/fastrodev/fastro/blob/main/examples/deno_postgres.ts)             |  6901 |  12% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [oauth](https://github.com/fastrodev/fastro/blob/main/examples/oauth.ts)                             |  6310 |  11% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [route_middleware](https://github.com/fastrodev/fastro/blob/main/examples/route_middleware.ts)       |  4390 |   8% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   |  1699 |   3% | `oha -j --no-tui -z 10s http://localhost:8000/static/tailwind.css` |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     |  1660 |   3% | `oha -j --no-tui -z 10s http://localhost:8000/static/favicon.ico`  |