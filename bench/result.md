# Benchmarks
| module                                                          | rps      | relative | cmd                                                            |
| --------------------------------------------------------------- | -------- | -------- | -------------------------------------------------------------- |
| [deno](/examples/deno.ts)                                       | 56312.73 | 100%     | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_string](/examples/hello_string.ts)                       | 52919.46 | 94%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [string](/examples/string.ts)                                   | 51191.33 | 91%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world](/examples/hello_world.ts)                         | 51186.77 | 91%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [main](/examples/main.ts)                                       | 45212.88 | 80%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_jsx](/examples/hello_jsx.tsx)                            | 41051.42 | 73%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [params](/examples/params.ts)                                   | 35132.68 | 62%      | `oha -j --no-tui -z 10s http://localhost:9000/agus?title=lead` |
| [container](/examples/container.ts)                             | 34932.77 | 62%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro](/examples/hello_world_fastro.ts)           | 34635.00 | 62%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_json](/examples/hello_json.ts)                           | 34456.92 | 61%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro_html](/examples/hello_world_fastro_html.ts) | 34356.22 | 61%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro_json](/examples/hello_world_fastro_json.ts) | 33454.68 | 59%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro_jsx](/examples/hello_world_fastro_jsx.tsx)  | 31748.59 | 56%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [ssr](/examples/ssr.ts)                                         | 29216.11 | 52%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [middleware](/examples/middleware.ts)                           | 28914.37 | 51%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [static_file](/examples/static_file.ts)                         | 26422.38 | 47%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |