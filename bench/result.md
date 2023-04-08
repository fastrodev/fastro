# Benchmark
| module                  | rps      | relative | cmd                                                           |
| ----------------------- | -------- | -------- | ------------------------------------------------------------- |
| string                  | 53590.03 | 100%     | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| deno                    | 53490.79 | 100%     | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world             | 52545.22 | 98%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_string            | 52005.51 | 97%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| main                    | 46638.56 | 87%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_jsx               | 42294.13 | 79%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world_fastro      | 35720.78 | 67%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world_fastro_html | 35342.02 | 66%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_json              | 33562.76 | 63%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| params                  | 33476.07 | 62%      | `oha -j --no-tui -z 1m http://localhost:9000/agus?title=lead` |
| hello_world_fastro_jsx  | 33259.75 | 62%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| container               | 32844.13 | 61%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| middleware              | 30313.41 | 57%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| ssr                     | 27629.21 | 52%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| static_file             | 27459.42 | 51%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world_fastro_json | 23914.52 | 45%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |