# Benchmarks
| module                                                          | rps      | relative | cmd                                                            |
| --------------------------------------------------------------- | -------- | -------- | -------------------------------------------------------------- |
| [deno](/examples/deno.ts)                                       | 60281.23 | 100%     | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [string](/examples/string.ts)                                   | 52407.69 | 87%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world](/examples/hello_world.ts)                         | 51255.57 | 85%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_string](/examples/hello_string.ts)                       | 50152.79 | 83%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [main](/examples/main.ts)                                       | 46304.54 | 77%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_jsx](/examples/hello_jsx.tsx)                            | 40746.60 | 68%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [params](/examples/params.ts)                                   | 39073.41 | 65%      | `oha -j --no-tui -z 10s http://localhost:9000/agus?title=lead` |
| [hello_world_fastro](/examples/hello_world_fastro.ts)           | 35964.20 | 60%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro_html](/examples/hello_world_fastro_html.ts) | 35078.39 | 58%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro_json](/examples/hello_world_fastro_json.ts) | 33940.11 | 56%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro_jsx](/examples/hello_world_fastro_jsx.tsx)  | 33753.16 | 56%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_json](/examples/hello_json.ts)                           | 33600.37 | 56%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [middleware](/examples/middleware.ts)                           | 33543.97 | 56%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [ssr](/examples/ssr.ts)                                         | 27793.99 | 46%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [container](/examples/container.ts)                             | 27685.55 | 46%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [static_file](/examples/static_file.ts)                         | 27064.68 | 45%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |