# 🏁 Fastro Performance Benchmark

![k6 logo](https://upload.wikimedia.org/wikipedia/commons/e/ef/K6-logo.svg)

Last update: Mon Mar  9 16:25:07 WIB 2026

This benchmark measures the performance of Fastro against native Deno `Deno.serve` across various scenarios.

| Scenario | Framework | Throughput (req/s) | Avg Latency | P95 Latency | % of Native | Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Root** | Native | 66107.41 | 1.43ms | 2.15ms | 100% | [native.ts](native.ts) |
| | Fastro | 70003.58 | 1.35ms | 2.2ms | 105.89% | [main.ts](main.ts) |
| **URL Params** | Native | 48545.40 | 1.97ms | 2.88ms | 100% | [native.ts](native.ts) |
| | Fastro | 56506.41 | 1.69ms | 2.43ms | 116.40% | [main.ts](main.ts) |
| **Query Params** | Native | 56470.89 | 1.68ms | 2.84ms | 100% | [native.ts](native.ts) |
| | Fastro | 63721.65 | 1.49ms | 2.5ms | 112.84% | [main.ts](main.ts) |
| **Middleware** | Native | 64383.54 | 1.47ms | 2.41ms | 100% | [native.ts](native.ts) |
| | Fastro | 64998.70 | 1.46ms | 2.38ms | 100.96% | [main.ts](main.ts) |
| **JSON POST** | Native | 35901.85 | 2.56ms | 3.78ms | 100% | [native.ts](native.ts) |
| | Fastro | 34815.89 | 2.73ms | 3.85ms | 96.98% | [main.ts](main.ts) |

## Prerequisites
To run this benchmark locally, ensure you have:
1. [Deno](https://deno.land/) installed.
2. [k6](https://k6.io/) installed and available on PATH as `k6`.
3. Port 3000 available.
4. Execute the script: `bash scripts/run_bench.sh`.

## Methodology
Each scenario starts its own server instance (Native, then Fastro) and measures them back-to-back, so both comparisons happen under similar system load. `k6` uses 100 virtual users for 15 seconds per measurement, preceded by a 5-second warmup phase (50 VUs) to allow V8 JIT compilation of hot paths. Results may vary depending on CPU load, memory usage, and other environmental factors. For best results, run on an idle machine.

For a deeper analysis, see [posts/benchmark](https://fastro.deno.dev/posts/benchmark).

