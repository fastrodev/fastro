# Benchmark
| module                  | rps      | relative | cmd                                                            |
| ----------------------- | -------- | -------- | -------------------------------------------------------------- |
| deno                    | 43247.03 | 100%     | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| string                  | 39215.89 | 91%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_string            | 38589.08 | 89%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world             | 38508.28 | 89%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| main                    | 36869.20 | 85%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_jsx               | 30891.80 | 71%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world_fastro      | 26266.59 | 61%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world_fastro_html | 25754.94 | 60%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| params                  | 25648.28 | 59%      | `oha -j --no-tui -z 30s http://localhost:9000/agus?title=lead` |
| hello_world_fastro_json | 25213.74 | 58%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_json              | 24897.30 | 58%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| hello_world_fastro_jsx  | 24537.80 | 57%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| container               | 24065.02 | 56%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| middleware              | 23191.32 | 54%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| static_file             | 20572.99 | 48%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |
| ssr                     | 19645.13 | 45%      | `oha -j --no-tui -z 30s http://localhost:9000`                 |