---
title: "Benchmarks"
description: This is the final output of an internal benchmark run on github action
image: https://fastro.dev/static/image.png
---

This is the final output of an internal benchmark run on [github action](https://github.com/fastrodev/fastro/actions). It consists of several simple applications for [specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 5 seconds. The results are then sorted by the fastest.

You can find the benchmark script in this code: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                               |   rps |    % | oha cmd                                                        |
| :--------------------------------------------------------------------------------------------------- | ----: | ---: | :------------------------------------------------------------- |
| [register](https://github.com/fastrodev/fastro/blob/main/examples/register.ts)                       | 58972 | 100% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 57848 |  98% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 57791 |  98% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 57699 |  98% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 56702 |  96% | `oha -j --no-tui -z 5s http://localhost:8000/agus?title=lead`  |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 56617 |  96% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 55788 |  95% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [record](https://github.com/fastrodev/fastro/blob/main/examples/record.ts)                           | 54788 |  93% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 50223 |  85% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                                 | 47379 |  80% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               | 46041 |  78% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                        | 45589 |  77% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   | 24939 |  42% | `oha -j --no-tui -z 5s http://localhost:8000/static/post.css`  |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 23034 |  39% | `oha -j --no-tui -z 5s http://localhost:8000/hello`            |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                         | 17933 |  30% | `oha -j --no-tui -z 5s http://localhost:8000/user?name=john`   |
| [markdown_hook](https://github.com/fastrodev/fastro/blob/main/examples/markdown_hook.ts)             | 13726 |  23% | `oha -j --no-tui -z 5s http://localhost:8000/hello`            |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                               |  5099 |   9% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     |  3888 |   7% | `oha -j --no-tui -z 5s http://localhost:8000/static/image.png` |