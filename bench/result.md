# Benchmarks
| module                                                          | rps      | relative | cmd                                                            |
| --------------------------------------------------------------- | -------- | -------- | -------------------------------------------------------------- |
| [deno](/examples/deno.ts)                                       | 49128.39 | 100%     | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [string](/examples/string.ts)                                   | 46937.26 | 96%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_string](/examples/hello_string.ts)                       | 45697.64 | 93%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world](/examples/hello_world.ts)                         | 44255.90 | 90%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [main](/examples/main.ts)                                       | 42707.59 | 87%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_jsx](/examples/hello_jsx.tsx)                            | 35804.02 | 73%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro_html](/examples/hello_world_fastro_html.ts) | 31278.40 | 64%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [container](/examples/container.ts)                             | 30196.09 | 61%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro](/examples/hello_world_fastro.ts)           | 30151.64 | 61%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_json](/examples/hello_json.ts)                           | 29581.73 | 60%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro_json](/examples/hello_world_fastro_json.ts) | 29107.89 | 59%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [hello_world_fastro_jsx](/examples/hello_world_fastro_jsx.tsx)  | 28398.19 | 58%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [params](/examples/params.ts)                                   | 26807.92 | 55%      | `oha -j --no-tui -z 10s http://localhost:9000/agus?title=lead` |
| [middleware](/examples/middleware.ts)                           | 24900.19 | 51%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [ssr](/examples/ssr.ts)                                         | 24432.50 | 50%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |
| [static_file](/examples/static_file.ts)                         | 23636.35 | 48%      | `oha -j --no-tui -z 10s http://localhost:9000`                 |