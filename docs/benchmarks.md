---
title: "Benchmarks"
description: This is the final output of an internal benchmark run in github action
image: https://fastro.dev/static/image.png
---

This is the final output of an internal benchmark run in [github action](https://github.com/fastrodev/fastro/actions) on `11/29/2023, 12:12:57 PM`. It consists of several simple applications for [specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 5 seconds. The results are then sorted by the fastest.

You can find the benchmark script in this code: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                                     |   rps |    % | oha cmd                                                        |
| :--------------------------------------------------------------------------------------------------------- | ----: | ---: | :------------------------------------------------------------- |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                                     | 52730 | 100% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                             | 52682 | 100% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [register](https://github.com/fastrodev/fastro/blob/main/examples/register.ts)                             | 49793 |  94% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)               | 49699 |  94% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                         | 48719 |  92% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                         | 47520 |  90% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)                     | 45952 |  87% | `oha -j --no-tui -z 5s http://localhost:8000/agus?title=lead`  |
| [record](https://github.com/fastrodev/fastro/blob/main/examples/record.ts)                                 | 44248 |  84% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                             | 44204 |  84% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [app_middleware](https://github.com/fastrodev/fastro/blob/main/examples/app_middleware.ts)                 | 40250 |  76% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts)       | 37561 |  71% | `oha -j --no-tui -z 5s http://localhost:8000/hello`            |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)         | 25738 |  49% | `oha -j --no-tui -z 5s http://localhost:8000/static/post.css`  |
| [ssr_with_layout](https://github.com/fastrodev/fastro/blob/main/examples/ssr_with_layout.ts)               | 24542 |  47% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                              | 20559 |  39% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                              | 20417 |  39% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [route_middleware](https://github.com/fastrodev/fastro/blob/main/examples/route_middleware.ts)             | 16394 |  31% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                               | 13505 |  26% | `oha -j --no-tui -z 5s http://localhost:8000/user?name=john`   |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                                       | 12711 |  24% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr_with_error](https://github.com/fastrodev/fastro/blob/main/examples/ssr_with_error.ts)                 | 11451 |  22% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [oauth](https://github.com/fastrodev/fastro/blob/main/examples/oauth.ts)                                   | 11114 |  21% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr_with_custom_folder](https://github.com/fastrodev/fastro/blob/main/examples/ssr_with_custom_folder.ts) | 11012 |  21% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr_with_custom_root](https://github.com/fastrodev/fastro/blob/main/examples/ssr_with_custom_root.ts)     | 10942 |  21% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                                     |  4144 |   8% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)           |  3226 |   6% | `oha -j --no-tui -z 5s http://localhost:8000/static/image.png` |