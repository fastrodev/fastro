# Benchmarks
| module                                                          | rps      | relative | cmd                                                            |
| --------------------------------------------------------------- | -------- | -------- | -------------------------------------------------------------- |
| [hello_string](/examples/hello_string.ts)                       | 47075.48 | 100%     | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world](/examples/hello_world.ts)                         | 46570.87 | 99%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [string](/examples/string.ts)                                   | 45627.57 | 97%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [deno](/examples/deno.ts)                                       | 45359.47 | 96%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [main](/examples/main.ts)                                       | 42001.79 | 89%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_jsx](/examples/hello_jsx.tsx)                            | 35133.64 | 75%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro](/examples/hello_world_fastro.ts)           | 30532.86 | 65%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro_html](/examples/hello_world_fastro_html.ts) | 29710.27 | 63%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_json](/examples/hello_json.ts)                           | 29698.30 | 63%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro_json](/examples/hello_world_fastro_json.ts) | 29380.55 | 62%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro_jsx](/examples/hello_world_fastro_jsx.tsx)  | 28453.20 | 60%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [container](/examples/container.ts)                             | 27395.16 | 58%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [ssr](/examples/ssr.ts)                                         | 26877.34 | 57%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [middleware](/examples/middleware.ts)                           | 25203.50 | 54%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [params](/examples/params.ts)                                   | 24867.44 | 53%      | `oha -j --no-tui -z 10s http://localhost:9000/agus?title=lead` |
| [static_file](/examples/static_file.ts)                         | 22438.18 | 48%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |