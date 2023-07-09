---
title: "Fastro internal benchmarks"
description: This is the final result of an internal benchmarks running on a github action
image: https://fastro.dev/static/image.png
author: Yanu Widodo
date: Jul 9, 2023
---

| module                                                                                                       | rps      | relative |
| ------------------------------------------------------------------------------------------------------------ | -------- | -------- |
| [deno](https://github.com/fastrodev/fastro/blob/main/examples/deno.ts)                                       | 63485.54 | 100%     |
| [fastro](https://github.com/fastrodev/fastro/blob/main/examples/fastro.ts)                                   | 53891.14 | 85%      |
| [hello_world](https://github.com/fastrodev/fastro/blob/main/examples/hello_world.ts)                         | 53804.41 | 85%      |
| [hello_world_fastro](https://github.com/fastrodev/fastro/blob/main/examples/hello_world_fastro.ts)           | 53652.07 | 85%      |
| [string](https://github.com/fastrodev/fastro/blob/main/examples/string.ts)                                   | 53416.75 | 84%      |
| [params](https://github.com/fastrodev/fastro/blob/main/examples/params.ts)                                   | 51968.06 | 82%      |
| [hello_world_fastro_json](https://github.com/fastrodev/fastro/blob/main/examples/hello_world_fastro_json.ts) | 50665.11 | 80%      |
| [hello_json](https://github.com/fastrodev/fastro/blob/main/examples/hello_json.ts)                           | 49199.37 | 77%      |
| [hello_string](https://github.com/fastrodev/fastro/blob/main/examples/hello_string.ts)                       | 47865.82 | 75%      |
| [hello_world_fastro_jsx](https://github.com/fastrodev/fastro/blob/main/examples/hello_world_fastro_jsx.tsx)  | 47350.49 | 75%      |
| [hello_jsx](https://github.com/fastrodev/fastro/blob/main/examples/hello_jsx.tsx)                            | 47262.38 | 74%      |
| [middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)                           | 12373.69 | 19%      |
| [static_file](https://github.com/fastrodev/fastro/blob/main/examples/static_file.ts)                         | 9416.91  | 15%      |
| [ssr](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)                                         | 8555.23  | 13%      |