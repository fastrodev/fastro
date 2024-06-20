---
title: "Benchmarks"
description: This is the final output of an internal benchmark run in github action
image: https://fastro.dev/fastro.png
---

This is the final output of an internal benchmark run in [github action](https://github.com/fastrodev/fastro/actions) on `6/20/2024, 12:41:09 AM`. It consists of several simple applications for [specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 10s. The results are then sorted by the fastest.

You can find the benchmark script in this code: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                               |   rps |    % | oha cmd                                                            |
| :--------------------------------------------------------------------------------------------------- | ----: | ---: | :----------------------------------------------------------------- |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               | 61710 | 100% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 52544 |  85% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [group](https://github.com/fastrodev/fastro/blob/main/examples/group.ts)                             | 52059 |  84% | `oha -j --no-tui -z 10s http://localhost:8000/api/user`            |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 51857 |  84% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 51363 |  83% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 50943 |  83% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 50215 |  81% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 48972 |  79% | `oha -j --no-tui -z 10s http://localhost:8000/agus?title=lead`     |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 47409 |  77% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [app_middleware](https://github.com/fastrodev/fastro/blob/main/examples/app_middleware.ts)           | 43552 |  71% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_sqlite](https://github.com/fastrodev/fastro/blob/main/examples/deno_sqlite.ts)                 | 37909 |  61% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [server_rendering](https://github.com/fastrodev/fastro/blob/main/examples/server_rendering.tsx)      | 24804 |  40% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                         | 21000 |  34% | `oha -j --no-tui -z 10s http://localhost:8000/user?name=john`      |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 13641 |  22% | `oha -j --no-tui -z 10s http://localhost:8000/blog/hello`          |
| [deno_mongo](https://github.com/fastrodev/fastro/blob/main/examples/deno_mongo.ts)                   | 10996 |  18% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_postgres](https://github.com/fastrodev/fastro/blob/main/examples/deno_postgres.ts)             | 10373 |  17% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_redis](https://github.com/fastrodev/fastro/blob/main/examples/deno_redis.ts)                   |  8470 |  14% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_mysql](https://github.com/fastrodev/fastro/blob/main/examples/deno_mysql.ts)                   |  7473 |  12% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [oauth](https://github.com/fastrodev/fastro/blob/main/examples/oauth.ts)                             |  5596 |   9% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [route_middleware](https://github.com/fastrodev/fastro/blob/main/examples/route_middleware.ts)       |  4284 |   7% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   |  1674 |   3% | `oha -j --no-tui -z 10s http://localhost:8000/static/tailwind.css` |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     |  1641 |   3% | `oha -j --no-tui -z 10s http://localhost:8000/static/favicon.ico`  |