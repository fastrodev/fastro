---
title: "Benchmarks"
description: This is the final output of an internal benchmark run in github action
image: https://fastro.dev/static/image.png
---

This is the final output of an internal benchmark run in [github action](https://github.com/fastrodev/fastro/actions) on `1/26/2024, 6:10:00 PM`. It consists of several simple applications for [specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 5 seconds. The results are then sorted by the fastest.

You can find the benchmark script in this code: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                                     |   rps |    % | oha cmd                                                        |
| :--------------------------------------------------------------------------------------------------------- | ----: | ---: | :------------------------------------------------------------- |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)                     | 63430 | 100% | `oha -j --no-tui -z 5s http://localhost:8000/agus?title=lead`  |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                                     | 60283 |  95% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts)       | 52499 |  83% | `oha -j --no-tui -z 5s http://localhost:8000/hello`            |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                         | 51337 |  81% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [register](https://github.com/fastrodev/fastro/blob/main/examples/register.ts)                             | 50901 |  80% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)               | 50089 |  79% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                         | 49249 |  78% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [record](https://github.com/fastrodev/fastro/blob/main/examples/record.ts)                                 | 47374 |  75% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                             | 47209 |  74% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                             | 46596 |  73% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [app_middleware](https://github.com/fastrodev/fastro/blob/main/examples/app_middleware.ts)                 | 42473 |  67% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr_with_custom_folder](https://github.com/fastrodev/fastro/blob/main/examples/ssr_with_custom_folder.ts) | 34869 |  55% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)         | 28025 |  44% | `oha -j --no-tui -z 5s http://localhost:8000/static/post.css`  |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                              | 22717 |  36% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                              | 22394 |  35% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [route_middleware](https://github.com/fastrodev/fastro/blob/main/examples/route_middleware.ts)             | 18730 |  30% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [oauth](https://github.com/fastrodev/fastro/blob/main/examples/oauth.ts)                                   | 16048 |  25% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                               | 14066 |  22% | `oha -j --no-tui -z 5s http://localhost:8000/user?name=john`   |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                                       | 13609 |  21% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr_with_layout](https://github.com/fastrodev/fastro/blob/main/examples/ssr_with_layout.ts)               | 13531 |  21% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr_with_error](https://github.com/fastrodev/fastro/blob/main/examples/ssr_with_error.ts)                 | 12337 |  19% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr_with_custom_root](https://github.com/fastrodev/fastro/blob/main/examples/ssr_with_custom_root.ts)     | 11623 |  18% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                                     |  4264 |   7% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)           |  3435 |   5% | `oha -j --no-tui -z 5s http://localhost:8000/static/image.png` |