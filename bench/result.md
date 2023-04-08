# Benchmark
| module                  | rps      | relative | cmd                                                           |
| ----------------------- | -------- | -------- | ------------------------------------------------------------- |
| deno                    | 40943.97 | 100%     | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_string            | 39967.02 | 98%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world             | 39434.75 | 96%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| string                  | 39063.78 | 95%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| main                    | 37114.61 | 91%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| middleware              | 37092.83 | 91%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_jsx               | 30404.58 | 74%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world_fastro_html | 26685.10 | 65%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world_fastro      | 26507.06 | 65%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| params                  | 26193.60 | 64%      | `oha -j --no-tui -z 1m http://localhost:9000/agus?title=lead` |
| hello_world_fastro_json | 25868.16 | 63%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_json              | 25405.89 | 62%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world_fastro_jsx  | 24955.62 | 61%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| container               | 24547.25 | 60%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| static_file             | 20882.53 | 51%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| ssr                     | 19927.72 | 49%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |