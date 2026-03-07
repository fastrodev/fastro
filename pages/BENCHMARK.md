# 🏁 Fastro Performance Benchmark

![k6 logo](https://upload.wikimedia.org/wikipedia/commons/e/ef/K6-logo.svg)

Last update: Sat Mar  7 10:31:06 WIB 2026

This benchmark measures the performance of Fastro against native Deno `Deno.serve` across various scenarios.

| Scenario | Framework | Throughput (req/s) | Avg Latency | P95 Latency | % of Native | Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Root** | Native | 60501.14 | 1.57ms | 2.38ms | 100% | [native.ts](native.ts) |
| | Fastro | 59457.84 | 1.6ms | 2.51ms | 98.28% | [main.ts](main.ts) |
| **URL Params** | Native | 63534.90 | 1.49ms | 2.58ms | 100% | [native.ts](native.ts) |
| | Fastro | 59795.07 | 1.58ms | 2.96ms | 94.11% | [main.ts](main.ts) |
| **Query Params** | Native | 55149.20 | 1.72ms | 2.96ms | 100% | [native.ts](native.ts) |
| | Fastro | 58408.15 | 1.62ms | 3.1ms | 105.91% | [main.ts](main.ts) |
| **Middleware** | Native | 50371.87 | 1.89ms | 2.88ms | 100% | [native.ts](native.ts) |
| | Fastro | 50267.10 | 1.9ms | 3.16ms | 99.79% | [main.ts](main.ts) |
| **JSON POST** | Native | 41311.82 | 2.3ms | 3.84ms | 100% | [native.ts](native.ts) |
| | Fastro | 39271.19 | 2.43ms | 4.79ms | 95.06% | [main.ts](main.ts) |

## Prerequisites
To run this benchmark locally, ensure you have:
1. [Deno](https://deno.land/) installed.
2. [k6](https://k6.io/) installed and available on PATH as `k6`.
3. Port 3000 available.
4. Execute the script: `bash scripts/run_bench.sh`.

## Methodology
Benchmark results are collected using `k6` with 100 virtual users for 10 seconds per scenario. Results may vary depending on CPU load, memory usage, system configuration, and other environmental factors. For more representative numbers, run the benchmark multiple times on an idle machine.

For a deeper analysis, see [posts/benchmark](https://fastro.deno.dev/posts/benchmark).
