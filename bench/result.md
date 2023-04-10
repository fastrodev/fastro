# Benchmarks
| module                                                          | rps      | relative | cmd                                                            |
| --------------------------------------------------------------- | -------- | -------- | -------------------------------------------------------------- |
| [deno](/examples/deno.ts)                                       | 44769.86 | 100%     | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [string](/examples/string.ts)                                   | 40586.68 | 91%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [main](/examples/main.ts)                                       | 38555.87 | 86%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_string](/examples/hello_string.ts)                       | 37454.88 | 84%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world](/examples/hello_world.ts)                         | 36808.07 | 82%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_jsx](/examples/hello_jsx.tsx)                            | 32592.51 | 73%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro](/examples/hello_world_fastro.ts)           | 29378.50 | 66%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro_html](/examples/hello_world_fastro_html.ts) | 28652.63 | 64%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro_json](/examples/hello_world_fastro_json.ts) | 28581.37 | 64%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro_jsx](/examples/hello_world_fastro_jsx.tsx)  | 27083.12 | 60%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_json](/examples/hello_json.ts)                           | 26659.80 | 60%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [ssr](/examples/ssr.ts)                                         | 25684.33 | 57%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [params](/examples/params.ts)                                   | 22167.96 | 50%      | `oha -j --no-tui -z 10s http://localhost:9000/agus?title=lead` |
| [middleware](/examples/middleware.ts)                           | 21980.73 | 49%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [container](/examples/container.ts)                             | 21799.39 | 49%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [static_file](/examples/static_file.ts)                         | 21001.35 | 47%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |