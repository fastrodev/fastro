# 🏁 Fastro Performance Benchmark

![k6 logo](https://upload.wikimedia.org/wikipedia/commons/e/ef/K6-logo.svg)

Last update: Sat Feb 28 16:44:23 WIB 2026

This benchmark measures the performance of Fastro against native Deno `Deno.serve` across various scenarios.

| Scenario | Framework | Throughput (req/s) | Avg Latency | P95 Latency | % of Native | Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Root** | Native | 63435.85 | 1.5ms | 2.63ms | 100% | [native.ts](native.ts) |
| | Fastro | 67988.50 | 1.38ms | 2.32ms | 107.18% | [main.ts](main.ts) |
| **URL Params** | Native | 62362.57 | 1.52ms | 2.84ms | 100% | [native.ts](native.ts) |
| | Fastro | 60724.02 | 1.56ms | 2.99ms | 97.37% | [main.ts](main.ts) |
| **Query Params** | Native | 57157.24 | 1.66ms | 2.92ms | 100% | [native.ts](native.ts) |
| | Fastro | 54495.18 | 1.74ms | 3.5ms | 95.34% | [main.ts](main.ts) |
| **Middleware** | Native | 55249.06 | 1.7ms | 2.86ms | 100% | [native.ts](native.ts) |
| | Fastro | 51717.89 | 1.83ms | 3.31ms | 93.61% | [main.ts](main.ts) |
| **JSON POST** | Native | 41386.28 | 2.28ms | 3.6ms | 100% | [native.ts](native.ts) |
| | Fastro | 37815.30 | 2.51ms | 5.13ms | 91.37% | [main.ts](main.ts) |

## Prerequisites
To run this benchmark locally, ensure you have:
1. [Deno](https://deno.land/) installed.
2. [k6](https://k6.io/) installed and available on PATH as `k6`.
3. Port 3000 available.
4. Execute the script: `bash scripts/run_bench.sh`.

## Methodology
Benchmark results are collected using `k6` with 100 virtual users for 10 seconds per scenario. Results may vary depending on CPU load, memory usage, system configuration, and other environmental factors. For more representative numbers, run the benchmark multiple times on an idle machine.

For a deeper analysis, see [posts/benchmark](https://fastro.deno.dev/posts/benchmark).

