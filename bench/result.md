# Benchmark
| module                  | rps      | relative | cmd                                                            |
| ----------------------- | -------- | -------- | -------------------------------------------------------------- |
| main                    | 30672.70 | 100%     | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| deno                    | 27076.48 | 88%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_string            | 24401.80 | 80%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world             | 23684.87 | 77%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| string                  | 22947.87 | 75%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_jsx               | 18794.19 | 61%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world_fastro_json | 17875.74 | 58%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world_fastro      | 16878.62 | 55%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| middleware              | 16653.36 | 54%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world_fastro_html | 16455.26 | 54%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_json              | 16242.89 | 53%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world_fastro_jsx  | 16092.64 | 52%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| container               | 15789.57 | 51%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| params                  | 15588.99 | 51%      | `oha -j --no-tui -z 30s http://localhost:9000/agus?title=lead` |
| static_file             | 14656.33 | 48%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| ssr                     | 13304.86 | 43%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |