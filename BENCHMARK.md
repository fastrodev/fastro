# 🏁 Fastro Performance Benchmark

Last update: Sat Feb  7 11:31:58 WIB 2026

This benchmark measures the performance of Fastro against native Deno `Deno.serve` across various scenarios.

| Scenario | Framework | Throughput (req/s) | Avg Latency | P95 Latency | % of Native | Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Root** | Native | 71627.84 | 1.31ms | 2.17ms | 100% | [native.ts](native.ts) |
| | Fastro | 65653.86 | 1.44ms | 2.08ms | 91.66% | [main.ts](main.ts) |
| **URL Params** | Native | 59323.91 | 1.6ms | 2.27ms | 100% | [native.ts](native.ts) |
| | Fastro | 69231.69 | 1.36ms | 2.47ms | 116.70% | [main.ts](main.ts) |
| **Query Params** | Native | 70900.21 | 1.33ms | 2.06ms | 100% | [native.ts](native.ts) |
| | Fastro | 69077.98 | 1.36ms | 2.4ms | 97.43% | [main.ts](main.ts) |
| **Middleware** | Native | 57535.87 | 1.64ms | 2.45ms | 100% | [native.ts](native.ts) |
| | Fastro | 66278.27 | 1.42ms | 2.54ms | 115.19% | [main.ts](main.ts) |
| **JSON POST** | Native | 47861.93 | 1.97ms | 3.1ms | 100% | [native.ts](native.ts) |
| | Fastro | 44835.40 | 2.12ms | 4.58ms | 93.68% | [main.ts](main.ts) |

## Prerequisites
To run this benchmark locally, ensure you have:
1. [Deno](https://deno.land/) installed.
2. [k6](https://k6.io/) binary placed in the root directory as `./k6`.
3. Port 3000 available.
4. Execute the script: `bash run_bench.sh`.

## Methodology
Benchmark results are collected using `k6` with 100 virtual users for 10 seconds per scenario. Results may vary depending on CPU load, memory usage, system configuration, and other environmental factors. For more representative numbers, run the benchmark multiple times on an idle machine.

For a deeper analysis, see [blog/benchmark](blog/benchmark).

