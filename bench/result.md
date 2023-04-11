# Benchmarks
| module                                                          | rps      | relative | cmd                                                            |
| --------------------------------------------------------------- | -------- | -------- | -------------------------------------------------------------- |
| [string](/examples/string.ts)                                   | 53031.00 | 100%     | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_string](/examples/hello_string.ts)                       | 52343.60 | 99%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [deno](/examples/deno.ts)                                       | 51548.28 | 97%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world](/examples/hello_world.ts)                         | 50647.17 | 96%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [main](/examples/main.ts)                                       | 47356.18 | 89%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_jsx](/examples/hello_jsx.tsx)                            | 42175.11 | 80%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [params](/examples/params.ts)                                   | 35946.15 | 68%      | `oha -j --no-tui -z 10s http://localhost:9000/agus?title=lead` |
| [hello_world_fastro](/examples/hello_world_fastro.ts)           | 35529.94 | 67%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [container](/examples/container.ts)                             | 33811.92 | 64%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro_json](/examples/hello_world_fastro_json.ts) | 33453.19 | 63%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_json](/examples/hello_json.ts)                           | 32972.02 | 62%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro_html](/examples/hello_world_fastro_html.ts) | 32763.00 | 62%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro_jsx](/examples/hello_world_fastro_jsx.tsx)  | 31522.71 | 59%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [middleware](/examples/middleware.ts)                           | 29798.18 | 56%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [ssr](/examples/ssr.ts)                                         | 29512.19 | 56%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [static_file](/examples/static_file.ts)                         | 26862.50 | 51%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |