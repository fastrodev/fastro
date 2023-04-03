# Benchmark
| module                  | rps      | relative | cmd                                                         |
| ----------------------- | -------- | -------- | ----------------------------------------------------------- |
| deno                    | 47660.82 | 100%     | oha -j --no-tui -z 1m http://localhost:9000                 |
| hello_world             | 46125.20 | 97%      | oha -j --no-tui -z 1m http://localhost:9000                 |
| string                  | 45352.54 | 95%      | oha -j --no-tui -z 1m http://localhost:9000                 |
| hello_string            | 44330.58 | 93%      | oha -j --no-tui -z 1m http://localhost:9000                 |
| middleware              | 41464.80 | 87%      | oha -j --no-tui -z 1m http://localhost:9000                 |
| main                    | 40133.22 | 84%      | oha -j --no-tui -z 1m http://localhost:9000                 |
| hello_jsx               | 36116.73 | 76%      | oha -j --no-tui -z 1m http://localhost:9000                 |
| hello_world_fastro      | 31069.87 | 65%      | oha -j --no-tui -z 1m http://localhost:9000                 |
| hello_world_fastro_html | 30280.02 | 64%      | oha -j --no-tui -z 1m http://localhost:9000                 |
| hello_json              | 29931.72 | 63%      | oha -j --no-tui -z 1m http://localhost:9000                 |
| hello_world_fastro_json | 29564.26 | 62%      | oha -j --no-tui -z 1m http://localhost:9000                 |
| container               | 29157.77 | 61%      | oha -j --no-tui -z 1m http://localhost:9000                 |
| hello_world_fastro_jsx  | 28538.87 | 60%      | oha -j --no-tui -z 1m http://localhost:9000                 |
| ssr                     | 27051.91 | 57%      | oha -j --no-tui -z 1m http://localhost:9000                 |
| params                  | 26959.00 | 57%      | oha -j --no-tui -z 1m http://localhost:9000/agus?title=lead |
| static_file             | 24637.22 | 52%      | oha -j --no-tui -z 1m http://localhost:9000                 |