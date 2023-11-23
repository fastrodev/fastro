---
title: "Benchmarks"
description: This is the final output of an internal benchmark run in github action
image: https://fastro.dev/static/image.png
---

This is the final output of an internal benchmark run in [github action](https://github.com/fastrodev/fastro/actions) on `11/23/2023, 6:10:36 AM`. It consists of several simple applications for [specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 5 seconds. The results are then sorted by the fastest.

You can find the benchmark script in this code: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                                     |   rps |    % | oha cmd                                                        |
| :--------------------------------------------------------------------------------------------------------- | ----: | ---: | :------------------------------------------------------------- |
| [oauth](https://github.com/fastrodev/fastro/blob/main/examples/oauth.ts)                                   | 86197 | 100% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                                     | 57316 |  66% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                             | 53660 |  62% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)               | 50195 |  58% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                         | 49050 |  57% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [register](https://github.com/fastrodev/fastro/blob/main/examples/register.ts)                             | 49040 |  57% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                         | 47893 |  56% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)                     | 46641 |  54% | `oha -j --no-tui -z 5s http://localhost:8000/agus?title=lead`  |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                             | 45602 |  53% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [record](https://github.com/fastrodev/fastro/blob/main/examples/record.ts)                                 | 44287 |  51% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [app_middleware](https://github.com/fastrodev/fastro/blob/main/examples/app_middleware.ts)                 | 40516 |  47% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts)       | 39456 |  46% | `oha -j --no-tui -z 5s http://localhost:8000/hello`            |
| [ssr_with_layout](https://github.com/fastrodev/fastro/blob/main/examples/ssr_with_layout.ts)               | 34239 |  40% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)         | 26005 |  30% | `oha -j --no-tui -z 5s http://localhost:8000/static/post.css`  |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                              | 20414 |  24% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                              | 20177 |  23% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [route_middleware](https://github.com/fastrodev/fastro/blob/main/examples/route_middleware.ts)             | 16311 |  19% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                               | 13465 |  16% | `oha -j --no-tui -z 5s http://localhost:8000/user?name=john`   |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                                       | 12216 |  14% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr_with_error](https://github.com/fastrodev/fastro/blob/main/examples/ssr_with_error.ts)                 | 11005 |  13% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr_with_custom_folder](https://github.com/fastrodev/fastro/blob/main/examples/ssr_with_custom_folder.ts) | 10955 |  13% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr_with_custom_root](https://github.com/fastrodev/fastro/blob/main/examples/ssr_with_custom_root.ts)     | 10907 |  13% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                                     |  4041 |   5% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)           |  3264 |   4% | `oha -j --no-tui -z 5s http://localhost:8000/static/image.png` |