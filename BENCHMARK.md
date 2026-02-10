# 🏁 Fastro Performance Benchmark

Last update: Tue Feb 10 05:45:17 WIB 2026

This benchmark measures the performance of Fastro against native Deno `Deno.serve` across various scenarios.

| Scenario | Framework | Throughput (req/s) | Avg Latency | P95 Latency | % of Native | Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Root** | Native | 67613.16 | 1.39ms | 2.57ms | 100% | [native.ts](native.ts) |
| | Fastro | 73971.94 | 1.27ms | 2.16ms | 109.40% | [main.ts](main.ts) |
| **URL Params** | Native | 71440.72 | 1.32ms | 2.14ms | 100% | [native.ts](native.ts) |
| | Fastro | 62722.67 | 1.5ms | 2.58ms | 87.80% | [main.ts](main.ts) |
| **Query Params** | Native | 62920.82 | 1.49ms | 2.49ms | 100% | [native.ts](native.ts) |
| | Fastro | 61666.42 | 1.53ms | 2.59ms | 98.01% | [main.ts](main.ts) |
| **Middleware** | Native | 62992.74 | 1.49ms | 2.64ms | 100% | [native.ts](native.ts) |
| | Fastro | 58471.96 | 1.61ms | 2.8ms | 92.82% | [main.ts](main.ts) |
| **JSON POST** | Native | 41547.97 | 2.27ms | 3.61ms | 100% | [native.ts](native.ts) |
| | Fastro | 37030.05 | 2.57ms | 5.29ms | 89.13% | [main.ts](main.ts) |

## Prerequisites
To run this benchmark locally, ensure you have:
1. [Deno](https://deno.land/) installed.
2. [k6](https://k6.io/) binary placed in the root directory as `./k6`.
3. Port 3000 available.
4. Execute the script: `bash scripts/run_bench.sh`.

## Methodology
Benchmark results are collected using `k6` with 100 virtual users for 10 seconds per scenario. Results may vary depending on CPU load, memory usage, system configuration, and other environmental factors. For more representative numbers, run the benchmark multiple times on an idle machine.

For a deeper analysis, see [blog/benchmark](blog/benchmark).

