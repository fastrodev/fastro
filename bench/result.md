# Benchmark
| module                  | rps      | relative | cmd                                                           |
| ----------------------- | -------- | -------- | ------------------------------------------------------------- |
| string                  | 45644.20 | 100%     | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| deno                    | 45585.08 | 100%     | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| hello_world             | 45343.31 | 99%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| hello_string            | 44540.04 | 98%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| main                    | 41599.02 | 91%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| hello_jsx               | 35292.72 | 77%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| hello_world_fastro_html | 31468.19 | 69%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| hello_world_fastro      | 30455.77 | 67%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| hello_world_fastro_json | 29990.18 | 66%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| container               | 29582.91 | 65%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| hello_json              | 29576.89 | 65%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| hello_world_fastro_jsx  | 28686.77 | 63%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| middleware              | 27347.86 | 60%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| params                  | 26534.83 | 58%      | `oha -j --no-tui -z 3m http://localhost:9000/agus?title=lead` |
| ssr                     | 26081.45 | 57%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| static_file             | 24079.27 | 53%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |