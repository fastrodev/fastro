# Benchmark
| module                  | rps      | relative | cmd                                                            |
| ----------------------- | -------- | -------- | -------------------------------------------------------------- |
| hello_string            | 47948.81 | 100%     | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| deno                    | 46285.71 | 97%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world             | 46251.99 | 96%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| string                  | 45957.13 | 96%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| main                    | 42760.29 | 89%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_jsx               | 36731.80 | 77%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world_fastro_html | 31466.83 | 66%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world_fastro      | 31035.11 | 65%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world_fastro_json | 30246.33 | 63%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_json              | 29825.03 | 62%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| container               | 29013.15 | 61%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world_fastro_jsx  | 28837.11 | 60%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| middleware              | 27802.20 | 58%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| params                  | 25715.36 | 54%      | `oha -j --no-tui -z 30s http://localhost:9000/agus?title=lead` |
| static_file             | 24965.88 | 52%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| ssr                     | 24644.15 | 51%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |