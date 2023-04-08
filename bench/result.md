# Benchmark
| module                  | rps      | relative | cmd                                                           |
| ----------------------- | -------- | -------- | ------------------------------------------------------------- |
| deno                    | 29778.84 | 100%     | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| main                    | 27817.90 | 93%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_string            | 24917.79 | 84%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| string                  | 24888.46 | 84%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world             | 20940.22 | 70%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| container               | 17223.52 | 58%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world_fastro_html | 17131.58 | 58%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_jsx               | 16940.26 | 57%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world_fastro      | 16646.20 | 56%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| middleware              | 16593.15 | 56%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world_fastro_json | 16266.64 | 55%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world_fastro_jsx  | 15882.03 | 53%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_json              | 15593.29 | 52%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| params                  | 15428.66 | 52%      | `oha -j --no-tui -z 1m http://localhost:9000/agus?title=lead` |
| static_file             | 15089.96 | 51%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| ssr                     | 13344.74 | 45%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |