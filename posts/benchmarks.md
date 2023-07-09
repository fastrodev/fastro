---
title: "Fastro internal benchmark"
description: This is the final result of an internal benchmarks running on a github action
image: https://fastro.dev/static/image.png
author: Yanu Widodo
date: Jul 9, 2023
---

| module                                                                                                       | rps      | relative |
| ------------------------------------------------------------------------------------------------------------ | -------- | -------- |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                                       | 69736.67 | 100%     |
| [fastro](https://github.com/fastrodev/fastro/blob/main/examples/fastro.ts)                                   | 60059.41 | 86%      |
| [hello_world](https://github.com/fastrodev/fastro/blob/main/examples/hello_world.ts)                         | 59716.38 | 86%      |
| [hello_world_fastro](https://github.com/fastrodev/fastro/blob/main/examples/hello_world_fastro.ts)           | 58768.89 | 84%      |
| [string](https://github.com/fastrodev/fastro/blob/main/examples/string.ts)                                   | 58698.59 | 84%      |
| [params](https://github.com/fastrodev/fastro/blob/main/examples/params.ts)                                   | 57619.61 | 83%      |
| [hello_world_fastro_json](https://github.com/fastrodev/fastro/blob/main/examples/hello_world_fastro_json.ts) | 56674.89 | 81%      |
| [hello_json](https://github.com/fastrodev/fastro/blob/main/examples/hello_json.ts)                           | 55103.26 | 79%      |
| [hello_world_fastro_jsx](https://github.com/fastrodev/fastro/blob/main/examples/hello_world_fastro_jsx.tsx)  | 53030.49 | 76%      |
| [hello_jsx](https://github.com/fastrodev/fastro/blob/main/examples/hello_jsx.tsx)                            | 51377.44 | 74%      |
| [hello_string](https://github.com/fastrodev/fastro/blob/main/examples/hello_string.ts)                       | 46121.71 | 66%      |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)                           | 15639.55 | 22%      |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)                         | 10191.63 | 15%      |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                                         | 7811.27  | 11%      |