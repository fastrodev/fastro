---
title: Benchmarks
description: This is the final output of an internal benchmark run in github action
image: https://fastro.dev/fastro.png
---

This is the final output of an internal benchmark run in [github action](https://github.com/fastrodev/fastro/actions) on `8/13/2024, 12:27:58 AM`. It consists of several simple applications for [specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 10s. The results are then sorted by the fastest.

You can find the benchmark script in this code: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                               |   rps |    % | oha cmd                                                            |
| :--------------------------------------------------------------------------------------------------- | ----: | ---: | :----------------------------------------------------------------- |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               | 53225 | 100% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [group](https://github.com/fastrodev/fastro/blob/main/examples/group.ts)                             | 50684 |  95% | `oha -j --no-tui -z 10s http://localhost:8000/api/user`            |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 49629 |  93% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 48764 |  92% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 48675 |  91% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 48463 |  91% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 48359 |  91% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 47360 |  89% | `oha -j --no-tui -z 10s http://localhost:8000/agus?title=lead`     |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 44936 |  84% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_sqlite](https://github.com/fastrodev/fastro/blob/main/examples/deno_sqlite.ts)                 | 44697 |  84% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [app_middleware](https://github.com/fastrodev/fastro/blob/main/examples/app_middleware.ts)           | 41866 |  79% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [server_rendering](https://github.com/fastrodev/fastro/blob/main/examples/server_rendering.tsx)      | 23422 |  44% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                         | 19550 |  37% | `oha -j --no-tui -z 10s http://localhost:8000/user?name=john`      |
| [deno_mongo](https://github.com/fastrodev/fastro/blob/main/examples/deno_mongo.ts)                   | 14982 |  28% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 10856 |  20% | `oha -j --no-tui -z 10s http://localhost:8000/blog/hello`          |
| [deno_postgres](https://github.com/fastrodev/fastro/blob/main/examples/deno_postgres.ts)             | 10500 |  20% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_redis](https://github.com/fastrodev/fastro/blob/main/examples/deno_redis.ts)                   |  8908 |  17% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [deno_mysql](https://github.com/fastrodev/fastro/blob/main/examples/deno_mysql.ts)                   |  6404 |  12% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [oauth](https://github.com/fastrodev/fastro/blob/main/examples/oauth.ts)                             |  5701 |  11% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [route_middleware](https://github.com/fastrodev/fastro/blob/main/examples/route_middleware.ts)       |  4645 |   9% | `oha -j --no-tui -z 10s http://localhost:8000`                     |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   |  1886 |   4% | `oha -j --no-tui -z 10s http://localhost:8000/static/tailwind.css` |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     |  1749 |   3% | `oha -j --no-tui -z 10s http://localhost:8000/static/favicon.ico`  |