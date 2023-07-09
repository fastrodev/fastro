---
title: "Fastro internal benchmark"
description: This is the final result of an internal benchmark running on a github action
image: https://fastro.dev/static/image.png
author: Yanu Widodo
date: Jul 9, 2023
---

| module                                                                                                       | rps      | relative | cmd                                                            |
| ------------------------------------------------------------------------------------------------------------ | -------- | -------- | -------------------------------------------------------------- |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                                       | 61081.10 | 100%     | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [string](https://github.com/fastrodev/fastro/blob/main/examples/string.ts)                                   | 54339.94 | 89%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [hello_world](https://github.com/fastrodev/fastro/blob/main/examples/hello_world.ts)                         | 53211.71 | 87%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [fastro](https://github.com/fastrodev/fastro/blob/main/examples/fastro.ts)                                   | 52630.09 | 86%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [hello_world_fastro](https://github.com/fastrodev/fastro/blob/main/examples/hello_world_fastro.ts)           | 52564.41 | 86%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [params](https://github.com/fastrodev/fastro/blob/main/examples/params.ts)                                   | 51901.06 | 85%      | `oha -j --no-tui -z 10s http://localhost:8000/agus?title=lead` |
| [hello_world_fastro_json](https://github.com/fastrodev/fastro/blob/main/examples/hello_world_fastro_json.ts) | 51292.54 | 84%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [hello_json](https://github.com/fastrodev/fastro/blob/main/examples/hello_json.ts)                           | 50845.64 | 83%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [hello_world_fastro_jsx](https://github.com/fastrodev/fastro/blob/main/examples/hello_world_fastro_jsx.tsx)  | 47664.21 | 78%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [hello_jsx](https://github.com/fastrodev/fastro/blob/main/examples/hello_jsx.tsx)                            | 46412.46 | 76%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [hello_string](https://github.com/fastrodev/fastro/blob/main/examples/hello_string.ts)                       | 43742.39 | 72%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)                           | 12934.89 | 21%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                                         | 8472.58  | 14%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)                         | 7144.15  | 12%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |