# 🏁 Fastro Performance Benchmark

![k6 logo](https://upload.wikimedia.org/wikipedia/commons/e/ef/K6-logo.svg)

Last update: Sat Mar  7 21:08:55 WIB 2026

This benchmark measures the performance of Fastro against native Deno `Deno.serve` across various scenarios.

| Scenario | Framework | Throughput (req/s) | Avg Latency | P95 Latency | % of Native | Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Root** | Native | 67294.34 | 1.4ms | 2.45ms | 100% | [native.ts](native.ts) |
| | Fastro | 64549.85 | 1.46ms | 2.54ms | 95.92% | [main.ts](main.ts) |
| **URL Params** | Native | 58381.92 | 1.62ms | 2.78ms | 100% | [native.ts](native.ts) |
| | Fastro | 61323.13 | 1.54ms | 2.62ms | 105.04% | [main.ts](main.ts) |
| **Query Params** | Native | 50334.73 | 1.9ms | 2.5ms | 100% | [native.ts](native.ts) |
| | Fastro | 54541.10 | 1.74ms | 2.51ms | 108.36% | [main.ts](main.ts) |
| **Middleware** | Native | 60465.19 | 1.56ms | 2.63ms | 100% | [native.ts](native.ts) |
| | Fastro | 61987.21 | 1.52ms | 2.62ms | 102.52% | [main.ts](main.ts) |
| **JSON POST** | Native | 39613.52 | 2.4ms | 3.66ms | 100% | [native.ts](native.ts) |
| | Fastro | 40514.39 | 2.34ms | 3.69ms | 102.27% | [main.ts](main.ts) |

## Prerequisites
To run this benchmark locally, ensure you have:
1. [Deno](https://deno.land/) installed.
2. [k6](https://k6.io/) installed and available on PATH as `k6`.
3. Port 3000 available.
4. Execute the script: `bash scripts/run_bench.sh`.

## Methodology
Benchmark results are collected using `k6` with 100 virtual users for 10 seconds per scenario. Results may vary depending on CPU load, memory usage, system configuration, and other environmental factors. For more representative numbers, run the benchmark multiple times on an idle machine.

For a deeper analysis, see [posts/benchmark](https://fastro.deno.dev/posts/benchmark).
