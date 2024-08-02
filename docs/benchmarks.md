---
title: Benchmarks
description: This is the final output of an internal benchmark run in github action
image: https://fastro.dev/fastro.png
---

This is the final output of an internal benchmark run in [github action](https://github.com/fastrodev/fastro/actions) on `8/2/2024, 10:49:06 PM`. It consists of several simple applications for [specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 10s. The results are then sorted by the fastest.

You can find the benchmark script in this code: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                               |   rps |    % | oha cmd                                                            |
| :--------------------------------------------------------------------------------------------------- | ----: | ---: | :----------------------------------------------------------------- |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               | 54191 | 100% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 49151 |  91% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 48971 |  90% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 48809 |  90% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [group](https://github.com/fastrodev/fastro/blob/main/examples/group.ts)                             | 48785 |  90% | `oha -j --no-tui -z 10s http://localhost:8000/api/user`            |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 48703 |  90% | `oha -j --no-tui -z 10s http://localhost:8000/agus?title=lead`     |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 48291 |  89% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 47614 |  88% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 44900 |  83% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [app_middleware](https://github.com/fastrodev/fastro/blob/main/examples/app_middleware.ts)           | 41717 |  77% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_sqlite](https://github.com/fastrodev/fastro/blob/main/examples/deno_sqlite.ts)                 | 33916 |  63% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [server_rendering](https://github.com/fastrodev/fastro/blob/main/examples/server_rendering.tsx)      | 23282 |  43% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                         | 19473 |  36% | `oha -j --no-tui -z 10s http://localhost:8000/user?name=john`      |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 14399 |  27% | `oha -j --no-tui -z 10s http://localhost:8000/blog/hello`          |
| [deno_mongo](https://github.com/fastrodev/fastro/blob/main/examples/deno_mongo.ts)                   | 10904 |  20% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_redis](https://github.com/fastrodev/fastro/blob/main/examples/deno_redis.ts)                   |  9850 |  18% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [oauth](https://github.com/fastrodev/fastro/blob/main/examples/oauth.ts)                             |  7589 |  14% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_postgres](https://github.com/fastrodev/fastro/blob/main/examples/deno_postgres.ts)             |  6907 |  13% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_mysql](https://github.com/fastrodev/fastro/blob/main/examples/deno_mysql.ts)                   |  6850 |  13% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [route_middleware](https://github.com/fastrodev/fastro/blob/main/examples/route_middleware.ts)       |  4435 |   8% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     |  1688 |   3% | `oha -j --no-tui -z 10s http://localhost:8000/static/favicon.ico`  |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   |  1642 |   3% | `oha -j --no-tui -z 10s http://localhost:8000/static/tailwind.css` |