---
title: "Internal benchmarks"
description: This is the final output of an internal benchmark run on github action
image: https://fastro.dev/static/image.png
author: Fastro
date: Jul 24, 2023
---

![bench](/static/bench.png)

This is the final output of an internal benchmark run on [github action](https://github.com/fastrodev/fastro/actions). It consists of a simple application for [a specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 5 seconds. The results are then sorted by the fastest.

You can find the benchmarks script on this page: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                               |   rps |    % | oha cmd                                                        |
| :--------------------------------------------------------------------------------------------------- | ----: | ---: | :------------------------------------------------------------- |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                                 | 55099 | 100% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 48218 |  88% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 44908 |  82% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               | 42568 |  77% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                        | 41750 |  76% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 41143 |  75% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 39755 |  72% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 36244 |  66% | `oha -j --no-tui -z 5s http://localhost:8000/agus?title=lead`  |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 31679 |  57% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 30318 |  55% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 25317 |  46% | `oha -j --no-tui -z 5s http://localhost:8000/hello`            |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   | 23349 |  42% | `oha -j --no-tui -z 5s http://localhost:8000/static/post.css`  |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                         | 22435 |  41% | `oha -j --no-tui -z 5s http://localhost:8000/user?name=john`   |
| [markdown_hook](https://github.com/fastrodev/fastro/blob/main/examples/markdown_hook.ts)             | 16119 |  29% | `oha -j --no-tui -z 5s http://localhost:8000/hello`            |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                               |  7898 |  14% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     |  6748 |  12% | `oha -j --no-tui -z 5s http://localhost:8000/static/image.png` |