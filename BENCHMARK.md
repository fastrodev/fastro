# 🏁 Fastro Performance Benchmark

Generated on: Tue Feb  3 15:38:24 WIB 2026

| Scenario | Framework | Requests/sec | Avg Latency | p(95) Latency | % of Native | Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Root | Native Deno | 63084.925766 | 1.49ms | 2.79ms | 100% | [native.ts](native.ts) |
| URL Params | Native Deno | 65711.595328 | 1.42ms | 2.45ms | 100% | [native.ts](native.ts) |
| Query Params | Native Deno | 53761.015962 | 1.75ms | 3.23ms | 100% | [native.ts](native.ts) |
| Middleware | Native Deno | 60022.029545 | 1.56ms | 2.83ms | 100% | [native.ts](native.ts) |
| JSON POST | Native Deno | 40226.880035 | 2.35ms | 4.06ms | 100% | [native.ts](native.ts) |
| Root | Fastro | 68582.661897 | 1.36ms | 2.55ms | 108.71% | [main.ts](main.ts) |
| URL Params | Fastro | 61497.964847 | 1.53ms | 3.09ms | 93.59% | [main.ts](main.ts) |
| Query Params | Fastro | 63828.857293 | 1.47ms | 2.75ms | 118.73% | [main.ts](main.ts) |
| Middleware | Fastro | 63410.717138 | 1.48ms | 2.72ms | 105.65% | [main.ts](main.ts) |
| JSON POST | Fastro | 39071.813824 | 2.43ms | 5.54ms | 97.13% | [main.ts](main.ts) |

## Prerequisites
To run this benchmark locally, ensure you have:
1. [Deno](https://deno.land/) installed.
2. [k6](https://k6.io/) binary placed in the root directory as `./k6`.
3. Port 3000 available.
4. Execute the script: `bash run_bench.sh`.
