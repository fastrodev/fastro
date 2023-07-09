---
title: "Fastro internal benchmark"
description: This is the final result of an internal benchmarks running on a github action
image: https://fastro.dev/static/image.png
author: Yanu Widodo
date: Jul 9, 2023
---

| module                                                                                                       | rps      | relative | cmd                                                            |
| ------------------------------------------------------------------------------------------------------------ | -------- | -------- | -------------------------------------------------------------- |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                                       | 57852.63 | 100%     | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [fastro](https://github.com/fastrodev/fastro/blob/main/examples/fastro.ts)                                   | 48373.61 | 84%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [hello_world_fastro](https://github.com/fastrodev/fastro/blob/main/examples/hello_world_fastro.ts)           | 47598.44 | 82%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [hello_world](https://github.com/fastrodev/fastro/blob/main/examples/hello_world.ts)                         | 47241.73 | 82%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [hello_string](https://github.com/fastrodev/fastro/blob/main/examples/hello_string.ts)                       | 45898.60 | 79%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [hello_json](https://github.com/fastrodev/fastro/blob/main/examples/hello_json.ts)                           | 45576.03 | 79%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [hello_world_fastro_json](https://github.com/fastrodev/fastro/blob/main/examples/hello_world_fastro_json.ts) | 45099.10 | 78%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [params](https://github.com/fastrodev/fastro/blob/main/examples/params.ts)                                   | 44737.62 | 77%      | `oha -j --no-tui -z 10s http://localhost:8000/agus?title=lead` |
| [string](https://github.com/fastrodev/fastro/blob/main/examples/string.ts)                                   | 43258.35 | 75%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [hello_world_fastro_jsx](https://github.com/fastrodev/fastro/blob/main/examples/hello_world_fastro_jsx.tsx)  | 42223.12 | 73%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [hello_jsx](https://github.com/fastrodev/fastro/blob/main/examples/hello_jsx.tsx)                            | 41658.73 | 72%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)                           | 13639.45 | 24%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                                         | 7141.31  | 12%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)                         | 6558.96  | 11%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |