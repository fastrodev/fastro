# 🏁 Fastro Performance Benchmark

![k6 logo](https://upload.wikimedia.org/wikipedia/commons/e/ef/K6-logo.svg)

Last update: Sat Feb 28 05:39:52 WIB 2026

This benchmark measures the performance of Fastro against native Deno `Deno.serve` across various scenarios.

| Scenario | Framework | Throughput (req/s) | Avg Latency | P95 Latency | % of Native | Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Root** | Native | 67411.13 | 1.4ms | 2.6ms | 100% | [native.ts](native.ts) |
| | Fastro | 72437.93 | 1.3ms | 2.34ms | 107.46% | [main.ts](main.ts) |
| **URL Params** | Native | 65161.73 | 1.45ms | 2.68ms | 100% | [native.ts](native.ts) |
| | Fastro | 62211.63 | 1.52ms | 2.8ms | 95.47% | [main.ts](main.ts) |
| **Query Params** | Native | 63305.17 | 1.5ms | 2.52ms | 100% | [native.ts](native.ts) |
| | Fastro | 59399.24 | 1.59ms | 2.92ms | 93.83% | [main.ts](main.ts) |
| **Middleware** | Native | 65497.70 | 1.44ms | 2.49ms | 100% | [native.ts](native.ts) |
| | Fastro | 58824.06 | 1.61ms | 2.99ms | 89.81% | [main.ts](main.ts) |
| **JSON POST** | Native | 39936.60 | 2.38ms | 4.08ms | 100% | [native.ts](native.ts) |
| | Fastro | 36999.36 | 2.57ms | 5.35ms | 92.65% | [main.ts](main.ts) |

## Prerequisites
To run this benchmark locally, ensure you have:
1. [Deno](https://deno.land/) installed.
2. [k6](https://k6.io/) installed and available on PATH as `k6`.
3. Port 3000 available.
4. Execute the script: `bash scripts/run_bench.sh`.

## Methodology
Benchmark results are collected using `k6` with 100 virtual users for 10 seconds per scenario. Results may vary depending on CPU load, memory usage, system configuration, and other environmental factors. For more representative numbers, run the benchmark multiple times on an idle machine.

For a deeper analysis, see [posts/benchmark](https://fastro.deno.dev/posts/benchmark).

