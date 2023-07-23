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
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               | 65441 | 100% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 54919 |  84% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 54573 |  83% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 52989 |  81% | `oha -j --no-tui -z 5s http://localhost:8000/agus?title=lead`  |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 52511 |  80% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 52237 |  80% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 51053 |  78% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                        | 45650 |  70% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 45207 |  69% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                                 | 32766 |  50% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   | 19932 |  30% | `oha -j --no-tui -z 5s http://localhost:8000/static/post.css`  |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 19909 |  30% | `oha -j --no-tui -z 5s http://localhost:8000/hello`            |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                         | 15189 |  23% | `oha -j --no-tui -z 5s http://localhost:8000/user?name=john`   |
| [markdown_hook](https://github.com/fastrodev/fastro/blob/main/examples/markdown_hook.ts)             | 13968 |  21% | `oha -j --no-tui -z 5s http://localhost:8000/hello`            |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                               |  4625 |   7% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     |  3566 |   5% | `oha -j --no-tui -z 5s http://localhost:8000/static/image.png` |