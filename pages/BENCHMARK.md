# 🏁 Fastro Performance Benchmark

![k6 logo](https://upload.wikimedia.org/wikipedia/commons/e/ef/K6-logo.svg)

Last update: Wed Feb 25 17:19:56 WIB 2026

This benchmark measures the performance of Fastro against native Deno `Deno.serve` across various scenarios.

| Scenario | Framework | Throughput (req/s) | Avg Latency | P95 Latency | % of Native | Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Root** | Native | 66033.49 | 1.43ms | 2.39ms | 100% | [native.ts](native.ts) |
| | Fastro | 65389.31 | 1.43ms | 2.59ms | 99.02% | [main.ts](main.ts) |
| **URL Params** | Native | 52105.45 | 1.82ms | 2.51ms | 100% | [native.ts](native.ts) |
| | Fastro | 52901.73 | 1.79ms | 2.72ms | 101.53% | [main.ts](main.ts) |
| **Query Params** | Native | 64903.82 | 1.45ms | 2.29ms | 100% | [native.ts](native.ts) |
| | Fastro | 61364.18 | 1.54ms | 2.67ms | 94.55% | [main.ts](main.ts) |
| **Middleware** | Native | 64128.66 | 1.47ms | 2.47ms | 100% | [native.ts](native.ts) |
| | Fastro | 59053.86 | 1.6ms | 2.84ms | 92.09% | [main.ts](main.ts) |
| **JSON POST** | Native | 35766.43 | 2.64ms | 3.61ms | 100% | [native.ts](native.ts) |
| | Fastro | 25264.77 | 3.63ms | 6.9ms | 70.64% | [main.ts](main.ts) |

## Prerequisites
To run this benchmark locally, ensure you have:
1. [Deno](https://deno.land/) installed.
2. [k6](https://k6.io/) binary placed in the root directory as `./k6`.
3. Port 3000 available.
4. Execute the script: `bash scripts/run_bench.sh`.

## Methodology
Benchmark results are collected using `k6` with 100 virtual users for 10 seconds per scenario. Results may vary depending on CPU load, memory usage, system configuration, and other environmental factors. For more representative numbers, run the benchmark multiple times on an idle machine.

For a deeper analysis, see [posts/benchmark](posts/benchmark).

