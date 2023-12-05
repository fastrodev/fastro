---
title: "Benchmarks"
description: This is the final output of an internal benchmark run in github action
image: https://fastro.dev/static/image.png
---

This is the final output of an internal benchmark run in [github action](https://github.com/fastrodev/fastro/actions) on `12/5/2023, 6:11:00 AM`. It consists of several simple applications for [specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 5 seconds. The results are then sorted by the fastest.

You can find the benchmark script in this code: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                                     |   rps |    % | oha cmd                                                        |
| :--------------------------------------------------------------------------------------------------------- | ----: | ---: | :------------------------------------------------------------- |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                                     | 56270 | 100% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                             | 51672 |  92% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                         | 48458 |  86% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [register](https://github.com/fastrodev/fastro/blob/main/examples/register.ts)                             | 48421 |  86% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)               | 48284 |  86% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)                     | 47396 |  84% | `oha -j --no-tui -z 5s http://localhost:8000/agus?title=lead`  |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                         | 47175 |  84% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts)       | 46276 |  82% | `oha -j --no-tui -z 5s http://localhost:8000/hello`            |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                             | 44922 |  80% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [record](https://github.com/fastrodev/fastro/blob/main/examples/record.ts)                                 | 43802 |  78% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [app_middleware](https://github.com/fastrodev/fastro/blob/main/examples/app_middleware.ts)                 | 39835 |  71% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr_with_layout](https://github.com/fastrodev/fastro/blob/main/examples/ssr_with_layout.ts)               | 36190 |  64% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)         | 25268 |  45% | `oha -j --no-tui -z 5s http://localhost:8000/static/post.css`  |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                              | 20299 |  36% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                              | 19931 |  35% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [route_middleware](https://github.com/fastrodev/fastro/blob/main/examples/route_middleware.ts)             | 16323 |  29% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                               | 13720 |  24% | `oha -j --no-tui -z 5s http://localhost:8000/user?name=john`   |
| [oauth](https://github.com/fastrodev/fastro/blob/main/examples/oauth.ts)                                   | 12764 |  23% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                                       | 12447 |  22% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr_with_error](https://github.com/fastrodev/fastro/blob/main/examples/ssr_with_error.ts)                 | 11005 |  20% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr_with_custom_folder](https://github.com/fastrodev/fastro/blob/main/examples/ssr_with_custom_folder.ts) | 10712 |  19% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr_with_custom_root](https://github.com/fastrodev/fastro/blob/main/examples/ssr_with_custom_root.ts)     | 10097 |  18% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                                     |  4086 |   7% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)           |  3418 |   6% | `oha -j --no-tui -z 5s http://localhost:8000/static/image.png` |