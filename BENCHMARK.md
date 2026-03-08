# 🏁 Fastro Performance Benchmark

![k6 logo](https://upload.wikimedia.org/wikipedia/commons/e/ef/K6-logo.svg)

Last update: Mon Mar  9 00:54:21 WIB 2026

This benchmark measures the performance of Fastro against native Deno `Deno.serve` across various scenarios.

| Scenario | Framework | Throughput (req/s) | Avg Latency | P95 Latency | % of Native | Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Root** | Native | 70061.06 | 1.35ms | 2.47ms | 100% | [native.ts](native.ts) |
| | Fastro | 67104.79 | 1.41ms | 2.51ms | 95.78% | [main.ts](main.ts) |
| **URL Params** | Native | 68501.75 | 1.38ms | 2.35ms | 100% | [native.ts](native.ts) |
| | Fastro | 63042.71 | 1.5ms | 2.63ms | 92.03% | [main.ts](main.ts) |
| **Query Params** | Native | 66118.61 | 1.43ms | 2.32ms | 100% | [native.ts](native.ts) |
| | Fastro | 62095.20 | 1.52ms | 2.64ms | 93.91% | [main.ts](main.ts) |
| **Middleware** | Native | 63877.86 | 1.48ms | 2.67ms | 100% | [native.ts](native.ts) |
| | Fastro | 63489.73 | 1.49ms | 2.57ms | 99.39% | [main.ts](main.ts) |
| **JSON POST** | Native | 42748.01 | 2.22ms | 3.44ms | 100% | [native.ts](native.ts) |
| | Fastro | 40181.28 | 2.37ms | 3.73ms | 94.00% | [main.ts](main.ts) |

## Prerequisites
To run this benchmark locally, ensure you have:
1. [Deno](https://deno.land/) installed.
2. [k6](https://k6.io/) installed and available on PATH as `k6`.
3. Port 3000 available.
4. Execute the script: `bash scripts/run_bench.sh`.

## Methodology
Benchmark results are collected using `k6` with 100 virtual users for 10 seconds per scenario. Results may vary depending on CPU load, memory usage, system configuration, and other environmental factors. For more representative numbers, run the benchmark multiple times on an idle machine.

For a deeper analysis, see [posts/benchmark](https://fastro.deno.dev/posts/benchmark).

