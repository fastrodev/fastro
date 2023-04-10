# Benchmarks
| module                  | rps      | relative | cmd                                                            |
| ----------------------- | -------- | -------- | -------------------------------------------------------------- |
| deno                    | 55382.95 | 100%     | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world             | 53139.28 | 96%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_string            | 52496.53 | 95%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| string                  | 52134.39 | 94%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| main                    | 47311.95 | 85%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_jsx               | 40790.68 | 74%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world_fastro_html | 36114.82 | 65%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world_fastro      | 34571.26 | 62%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| params                  | 34367.35 | 62%      | `oha -j --no-tui -z 30s http://localhost:9000/agus?title=lead` |
| hello_world_fastro_jsx  | 33772.76 | 61%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world_fastro_json | 33746.90 | 61%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_json              | 33568.96 | 61%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| container               | 31841.63 | 57%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| ssr                     | 28553.35 | 52%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| middleware              | 28394.33 | 51%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| static_file             | 27496.38 | 50%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |