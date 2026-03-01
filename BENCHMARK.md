# 🏁 Fastro Performance Benchmark

![k6 logo](https://upload.wikimedia.org/wikipedia/commons/e/ef/K6-logo.svg)

Last update: Sun Mar  1 15:34:43 WIB 2026

This benchmark measures the performance of Fastro against native Deno `Deno.serve` across various scenarios.

| Scenario | Framework | Throughput (req/s) | Avg Latency | P95 Latency | % of Native | Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Root** | Native | 63611.89 | 1.49ms | 2ms | 100% | [native.ts](native.ts) |
| | Fastro | 78747.46 | 1.2ms | 2.05ms | 123.79% | [main.ts](main.ts) |
| **URL Params** | Native | 71266.12 | 1.33ms | 2.28ms | 100% | [native.ts](native.ts) |
| | Fastro | 47487.68 | 1.98ms | 3.17ms | 66.63% | [main.ts](main.ts) |
| **Query Params** | Native | 69107.09 | 1.37ms | 2.24ms | 100% | [native.ts](native.ts) |
| | Fastro | 62329.83 | 1.52ms | 2.77ms | 90.19% | [main.ts](main.ts) |
| **Middleware** | Native | 43775.26 | 2.19ms | 3.27ms | 100% | [native.ts](native.ts) |
| | Fastro | 60649.90 | 1.57ms | 2.93ms | 138.55% | [main.ts](main.ts) |
| **JSON POST** | Native | 45104.79 | 2.1ms | 3.3ms | 100% | [native.ts](native.ts) |
| | Fastro | 30117.48 | 3.17ms | 5.31ms | 66.77% | [main.ts](main.ts) |

## Prerequisites
To run this benchmark locally, ensure you have:
1. [Deno](https://deno.land/) installed.
2. [k6](https://k6.io/) installed and available on PATH as `k6`.
3. Port 3000 available.
4. Execute the script: `bash scripts/run_bench.sh`.

## Methodology
Benchmark results are collected using `k6` with 100 virtual users for 10 seconds per scenario. Results may vary depending on CPU load, memory usage, system configuration, and other environmental factors. For more representative numbers, run the benchmark multiple times on an idle machine.

For a deeper analysis, see [posts/benchmark](https://fastro.deno.dev/posts/benchmark).

