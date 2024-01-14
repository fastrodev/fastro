---
title: "Benchmarks"
description: This is the final output of an internal benchmark run in github action
image: https://fastro.dev/static/image.png
---

This is the final output of an internal benchmark run in [github action](https://github.com/fastrodev/fastro/actions) on `1/14/2024, 12:11:40 PM`. It consists of several simple applications for [specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 5 seconds. The results are then sorted by the fastest.

You can find the benchmark script in this code: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                                     |   rps |    % | oha cmd                                                        |
| :--------------------------------------------------------------------------------------------------------- | ----: | ---: | :------------------------------------------------------------- |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                                       | 73378 | 100% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                                     | 59493 |  81% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [oauth](https://github.com/fastrodev/fastro/blob/main/examples/oauth.ts)                                   | 54807 |  75% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                         | 50892 |  69% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)               | 49665 |  68% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [register](https://github.com/fastrodev/fastro/blob/main/examples/register.ts)                             | 49524 |  67% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                         | 49201 |  67% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)                     | 47623 |  65% | `oha -j --no-tui -z 5s http://localhost:8000/agus?title=lead`  |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                             | 46548 |  63% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                             | 46060 |  63% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [record](https://github.com/fastrodev/fastro/blob/main/examples/record.ts)                                 | 45498 |  62% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [app_middleware](https://github.com/fastrodev/fastro/blob/main/examples/app_middleware.ts)                 | 42629 |  58% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts)       | 34352 |  47% | `oha -j --no-tui -z 5s http://localhost:8000/hello`            |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)         | 28249 |  38% | `oha -j --no-tui -z 5s http://localhost:8000/static/post.css`  |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                              | 21190 |  29% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                              | 20891 |  28% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [route_middleware](https://github.com/fastrodev/fastro/blob/main/examples/route_middleware.ts)             | 15437 |  21% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                               | 13830 |  19% | `oha -j --no-tui -z 5s http://localhost:8000/user?name=john`   |
| [ssr_with_layout](https://github.com/fastrodev/fastro/blob/main/examples/ssr_with_layout.ts)               | 12893 |  18% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr_with_error](https://github.com/fastrodev/fastro/blob/main/examples/ssr_with_error.ts)                 | 11524 |  16% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr_with_custom_folder](https://github.com/fastrodev/fastro/blob/main/examples/ssr_with_custom_folder.ts) | 11517 |  16% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr_with_custom_root](https://github.com/fastrodev/fastro/blob/main/examples/ssr_with_custom_root.ts)     | 11408 |  16% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                                     |  4191 |   6% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)           |  3340 |   5% | `oha -j --no-tui -z 5s http://localhost:8000/static/image.png` |