# Benchmark
| module                  | rps      | relative | cmd                                                           |
| ----------------------- | -------- | -------- | ------------------------------------------------------------- |
| deno                    | 44448.98 | 100%     | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| hello_string            | 40447.42 | 91%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| string                  | 40436.06 | 91%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| hello_world             | 39562.17 | 89%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| main                    | 37916.34 | 85%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| hello_jsx               | 32083.13 | 72%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| hello_world_fastro      | 27251.44 | 61%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| hello_world_fastro_html | 26978.86 | 61%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| container               | 26730.18 | 60%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| hello_world_fastro_json | 26088.23 | 59%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| hello_json              | 25822.60 | 58%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| hello_world_fastro_jsx  | 25018.10 | 56%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| params                  | 24347.96 | 55%      | `oha -j --no-tui -z 3m http://localhost:9000/agus?title=lead` |
| middleware              | 24214.01 | 54%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| ssr                     | 22589.87 | 51%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |
| static_file             | 21508.58 | 48%      | `oha -j --no-tui -z 3m http://localhost:9000`                 |