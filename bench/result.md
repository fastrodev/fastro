# Benchmark
| module                  | rps      | relative | cmd                                                           |
| ----------------------- | -------- | -------- | ------------------------------------------------------------- |
| deno                    | 30510.67 | 100%     | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| main                    | 28945.71 | 95%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| string                  | 24797.55 | 81%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_string            | 24706.09 | 81%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world             | 24521.87 | 80%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| middleware              | 19702.07 | 65%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world_fastro_jsx  | 19070.07 | 63%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_jsx               | 18601.42 | 61%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world_fastro_html | 17711.08 | 58%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world_fastro_json | 17333.95 | 57%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_world_fastro      | 16914.99 | 55%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| container               | 16825.13 | 55%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| hello_json              | 16578.55 | 54%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| static_file             | 15814.53 | 52%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |
| params                  | 15699.23 | 51%      | `oha -j --no-tui -z 1m http://localhost:9000/agus?title=lead` |
| ssr                     | 13333.36 | 44%      | `oha -j --no-tui -z 1m http://localhost:9000`                 |