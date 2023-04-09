# Benchmark
| module                  | rps      | relative | cmd                                                            |
| ----------------------- | -------- | -------- | -------------------------------------------------------------- |
| deno                    | 56192.37 | 100%     | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_string            | 52946.52 | 94%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world             | 52308.45 | 93%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| string                  | 51472.73 | 92%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| main                    | 46380.11 | 83%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_jsx               | 41349.60 | 74%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| params                  | 36093.69 | 64%      | `oha -j --no-tui -z 30s http://localhost:9000/agus?title=lead` |
| hello_world_fastro_html | 34599.41 | 62%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world_fastro      | 34413.89 | 61%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_json              | 33796.87 | 60%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world_fastro_json | 33302.68 | 59%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world_fastro_jsx  | 32465.78 | 58%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| middleware              | 31621.79 | 56%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| container               | 30859.39 | 55%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| static_file             | 27378.57 | 49%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| ssr                     | 26572.23 | 47%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |