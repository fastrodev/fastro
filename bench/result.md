# Benchmarks
| module                                                          | rps      | relative | cmd                                                            |
| --------------------------------------------------------------- | -------- | -------- | -------------------------------------------------------------- |
| [deno](/examples/deno.ts)                                       | 63245.40 | 100%     | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [fastro](/examples/fastro.ts)                                   | 54038.23 | 85%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [string](/examples/string.ts)                                   | 53779.69 | 85%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [hello_world_fastro](/examples/hello_world_fastro.ts)           | 53732.17 | 85%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [hello_world](/examples/hello_world.ts)                         | 52336.33 | 83%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [params](/examples/params.ts)                                   | 52332.52 | 83%      | `oha -j --no-tui -z 10s http://localhost:8000/agus?title=lead` |
| [hello_world_fastro_json](/examples/hello_world_fastro_json.ts) | 52095.21 | 82%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [hello_json](/examples/hello_json.ts)                           | 51022.68 | 81%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [hello_world_fastro_jsx](/examples/hello_world_fastro_jsx.tsx)  | 48350.98 | 76%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [hello_jsx](/examples/hello_jsx.tsx)                            | 48066.83 | 76%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [hello_string](/examples/hello_string.ts)                       | 41479.15 | 66%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [middleware](/examples/middleware.ts)                           | 14885.44 | 24%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [ssr](/examples/ssr.ts)                                         | 7530.22  | 12%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |
| [static_file](/examples/static_file.ts)                         | 7380.73  | 12%      | `oha -j --no-tui -z 10s http://localhost:8000`                 |