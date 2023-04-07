# Benchmark
| module                  | rps      | relative | cmd                                                           |
| ----------------------- | -------- | -------- | ------------------------------------------------------------- |
| deno                    | 48543.66 | 100%     | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| string                  | 48179.54 | 99%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world             | 46165.31 | 95%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_string            | 45670.04 | 94%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| middleware              | 42154.30 | 87%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| main                    | 41946.04 | 86%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_jsx               | 35008.41 | 72%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world_fastro      | 31271.85 | 64%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_json              | 30157.88 | 62%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world_fastro_html | 30017.15 | 62%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| container               | 29280.24 | 60%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world_fastro_json | 29097.86 | 60%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world_fastro_jsx  | 28789.88 | 59%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| params                  | 27179.84 | 56%      | `oha -j --no-tui -z 1m http://localhost:9000/agus?title=lead` |
| ssr                     | 25084.91 | 52%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| static_file             | 24432.01 | 50%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |