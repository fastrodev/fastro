---
title: Benchmarks
description: This is the final output of an internal benchmark run in github action
image: https://fastro.dev/fastro.png
---

This is the final output of an internal benchmark run in [github action](https://github.com/fastrodev/fastro/actions) on `7/11/2024, 1:00:49 AM`. It consists of several simple applications for [specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 10s. The results are then sorted by the fastest.

You can find the benchmark script in this code: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                               |   rps |    % | oha cmd                                                            |
| :--------------------------------------------------------------------------------------------------- | ----: | ---: | :----------------------------------------------------------------- |
| [deno_mysql](https://github.com/fastrodev/fastro/blob/main/examples/deno_mysql.ts)                   | 61730 | 100% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               | 54414 |  88% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 49986 |  81% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 49592 |  80% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [group](https://github.com/fastrodev/fastro/blob/main/examples/group.ts)                             | 49451 |  80% | `oha -j --no-tui -z 10s http://localhost:8000/api/user`            |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 49281 |  80% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 48996 |  79% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 46705 |  76% | `oha -j --no-tui -z 10s http://localhost:8000/agus?title=lead`     |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 46670 |  76% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 45450 |  74% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_sqlite](https://github.com/fastrodev/fastro/blob/main/examples/deno_sqlite.ts)                 | 32116 |  52% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [server_rendering](https://github.com/fastrodev/fastro/blob/main/examples/server_rendering.tsx)      | 29729 |  48% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_redis](https://github.com/fastrodev/fastro/blob/main/examples/deno_redis.ts)                   | 23258 |  38% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 20295 |  33% | `oha -j --no-tui -z 10s http://localhost:8000/blog/hello`          |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                         | 19987 |  32% | `oha -j --no-tui -z 10s http://localhost:8000/user?name=john`      |
| [deno_mongo](https://github.com/fastrodev/fastro/blob/main/examples/deno_mongo.ts)                   | 17973 |  29% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [oauth](https://github.com/fastrodev/fastro/blob/main/examples/oauth.ts)                             | 11589 |  19% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_postgres](https://github.com/fastrodev/fastro/blob/main/examples/deno_postgres.ts)             |  7219 |  12% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [route_middleware](https://github.com/fastrodev/fastro/blob/main/examples/route_middleware.ts)       |  4373 |   7% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [app_middleware](https://github.com/fastrodev/fastro/blob/main/examples/app_middleware.ts)           |  3981 |   6% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     |  1689 |   3% | `oha -j --no-tui -z 10s http://localhost:8000/static/favicon.ico`  |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   |  1671 |   3% | `oha -j --no-tui -z 10s http://localhost:8000/static/tailwind.css` |