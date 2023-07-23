---
title: "Internal benchmarks"
description: This is the final output of an internal benchmark run on github action
image: https://fastro.dev/static/image.png
author: Fastro
date: Jul 23, 2023
---

![bench](/static/bench.png)

This is the final output of an internal benchmark run on [github action](https://github.com/fastrodev/fastro/actions). It consists of a simple application for [a specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 5 seconds. The results are then sorted by the fastest.

You can find the benchmarks script on this page: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                               |   rps |    % | oha cmd                                                        |
| :--------------------------------------------------------------------------------------------------- | ----: | ---: | :------------------------------------------------------------- |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               | 40456 | 100% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 32503 |  80% | `oha -j --no-tui -z 5s http://localhost:8000/agus?title=lead`  |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 32433 |  80% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 32135 |  79% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 31511 |  78% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 30984 |  77% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                        | 29224 |  72% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 27849 |  69% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 22796 |  56% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 15099 |  37% | `oha -j --no-tui -z 5s http://localhost:8000/hello`            |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   | 14552 |  36% | `oha -j --no-tui -z 5s http://localhost:8000/static/post.css`  |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                                 | 14093 |  35% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                         | 10076 |  25% | `oha -j --no-tui -z 5s http://localhost:8000/user?name=john`   |
| [markdown_hook](https://github.com/fastrodev/fastro/blob/main/examples/markdown_hook.ts)             |  9539 |  24% | `oha -j --no-tui -z 5s http://localhost:8000/hello`            |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     |  3136 |   8% | `oha -j --no-tui -z 5s http://localhost:8000/static/image.png` |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                               |  2773 |   7% | `oha -j --no-tui -z 5s http://localhost:8000`                  |