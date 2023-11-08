---
title: "Benchmarks"
description: This is the final output of an internal benchmark run in github action
image: https://fastro.dev/static/image.png
---

This is the final output of an internal benchmark run in [github action](https://github.com/fastrodev/fastro/actions) on `11/8/2023, 6:09:24 PM`. It consists of several simple applications for [specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within 5 seconds. The results are then sorted by the fastest.

You can find the benchmark script in this code: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results


| module                                                                                               |   rps |    % | oha cmd                                                        |
| :--------------------------------------------------------------------------------------------------- | ----: | ---: | :------------------------------------------------------------- |
| [markdown_middleware](https://github.com/fastrodev/fastro/blob/main/examples/markdown_middleware.ts) | 69189 | 100% | `oha -j --no-tui -z 5s http://localhost:8000/hello`            |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                               | 54126 |  78% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [register](https://github.com/fastrodev/fastro/blob/main/examples/register.ts)                       | 49412 |  71% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_string](https://github.com/fastrodev/fastro/blob/main/examples/raw_string.ts)                   | 49096 |  71% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_string](https://github.com/fastrodev/fastro/blob/main/examples/ctx_string.ts)                   | 47715 |  69% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [params_query](https://github.com/fastrodev/fastro/blob/main/examples/params_query.ts)               | 47597 |  69% | `oha -j --no-tui -z 5s http://localhost:8000/agus?title=lead`  |
| [string_response](https://github.com/fastrodev/fastro/blob/main/examples/string_response.ts)         | 47514 |  69% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_json](https://github.com/fastrodev/fastro/blob/main/examples/raw_json.ts)                       | 45169 |  65% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ctx_json](https://github.com/fastrodev/fastro/blob/main/examples/ctx_json.ts)                       | 44186 |  64% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [record](https://github.com/fastrodev/fastro/blob/main/examples/record.ts)                           | 43298 |  63% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [app_middleware](https://github.com/fastrodev/fastro/blob/main/examples/app_middleware.ts)           | 40509 |  59% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [ssr_with_layout](https://github.com/fastrodev/fastro/blob/main/examples/ssr_with_layout.tsx)        | 36677 |  53% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [static_file_string](https://github.com/fastrodev/fastro/blob/main/examples/static_file_string.ts)   | 25112 |  36% | `oha -j --no-tui -z 5s http://localhost:8000/static/post.css`  |
| [ctx_jsx](https://github.com/fastrodev/fastro/blob/main/examples/ctx_jsx.tsx)                        | 20889 |  30% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [raw_jsx](https://github.com/fastrodev/fastro/blob/main/examples/raw_jsx.tsx)                        | 20665 |  30% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [route_middleware](https://github.com/fastrodev/fastro/blob/main/examples/route_middleware.ts)       | 16727 |  24% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [deno_kv](https://github.com/fastrodev/fastro/blob/main/examples/deno_kv.ts)                         | 13735 |  20% | `oha -j --no-tui -z 5s http://localhost:8000/user?name=john`   |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                                 | 13725 |  20% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [hook](https://github.com/fastrodev/fastro/blob/main/examples/hook.ts)                               |  4101 |   6% | `oha -j --no-tui -z 5s http://localhost:8000`                  |
| [static_file_image](https://github.com/fastrodev/fastro/blob/main/examples/static_file_image.ts)     |  3493 |   5% | `oha -j --no-tui -z 5s http://localhost:8000/static/image.png` |