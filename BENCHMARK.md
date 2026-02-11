# 🏁 Fastro Performance Benchmark

![k6 logo](https://upload.wikimedia.org/wikipedia/commons/e/ef/K6-logo.svg)

Last update: Wed Feb 11 11:09:06 WIB 2026

This benchmark measures the performance of Fastro against native Deno `Deno.serve` across various scenarios.

| Scenario | Framework | Throughput (req/s) | Avg Latency | P95 Latency | % of Native | Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Root** | Native | 56487.59 | 1.62ms | 2.25ms | 100% | [native.ts](native.ts) |
| | Fastro | 58415.48 | 1.61ms | 2.18ms | 103.41% | [main.ts](main.ts) |
| **URL Params** | Native | 70051.01 | 1.34ms | 2.39ms | 100% | [native.ts](native.ts) |
| | Fastro | 67187.56 | 1.4ms | 2.59ms | 95.91% | [main.ts](main.ts) |
| **Query Params** | Native | 71441.01 | 1.32ms | 2.14ms | 100% | [native.ts](native.ts) |
| | Fastro | 68697.09 | 1.37ms | 2.45ms | 96.16% | [main.ts](main.ts) |
| **Middleware** | Native | 55377.44 | 1.72ms | 2.13ms | 100% | [native.ts](native.ts) |
| | Fastro | 49484.92 | 1.81ms | 2.53ms | 89.36% | [main.ts](main.ts) |
| **JSON POST** | Native | 47975.98 | 1.97ms | 3.12ms | 100% | [native.ts](native.ts) |
| | Fastro | 41570.44 | 2.29ms | 4.84ms | 86.65% | [main.ts](main.ts) |

## Prerequisites
To run this benchmark locally, ensure you have:
1. [Deno](https://deno.land/) installed.
2. [k6](https://k6.io/) binary placed in the root directory as `./k6`.
3. Port 3000 available.
4. Execute the script: `bash scripts/run_bench.sh`.

## Methodology
Benchmark results are collected using `k6` with 100 virtual users for 10 seconds per scenario. Results may vary depending on CPU load, memory usage, system configuration, and other environmental factors. For more representative numbers, run the benchmark multiple times on an idle machine.

For a deeper analysis, see [blog/benchmark](blog/benchmark).

