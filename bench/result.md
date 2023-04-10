# Benchmarks
| module                                                          | rps      | relative | cmd                                                            |
| --------------------------------------------------------------- | -------- | -------- | -------------------------------------------------------------- |
| [string](/examples/string.ts)                                   | 45892.31 | 100%     | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_string](/examples/hello_string.ts)                       | 45745.34 | 100%     | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [deno](/examples/deno.ts)                                       | 44890.12 | 98%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world](/examples/hello_world.ts)                         | 42350.63 | 92%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [main](/examples/main.ts)                                       | 40311.70 | 88%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_jsx](/examples/hello_jsx.tsx)                            | 35530.14 | 77%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro_html](/examples/hello_world_fastro_html.ts) | 29703.67 | 65%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro](/examples/hello_world_fastro.ts)           | 29583.57 | 64%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro_json](/examples/hello_world_fastro_json.ts) | 29237.39 | 64%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_json](/examples/hello_json.ts)                           | 28466.06 | 62%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [params](/examples/params.ts)                                   | 27966.44 | 61%      | `oha -j --no-tui -z 10s http://localhost:9000/agus?title=lead` |
| [hello_world_fastro_jsx](/examples/hello_world_fastro_jsx.tsx)  | 27653.83 | 60%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [container](/examples/container.ts)                             | 27590.92 | 60%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [ssr](/examples/ssr.ts)                                         | 25112.17 | 55%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [middleware](/examples/middleware.ts)                           | 24887.31 | 54%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [static_file](/examples/static_file.ts)                         | 23967.51 | 52%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |