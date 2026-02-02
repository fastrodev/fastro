# Fastro Performance Benchmark

Generated on: Tue Feb  3 05:44:53 WIB 2026

| Framework | Requests/sec | Avg Latency | p(95) Latency | % of Native |
| :--- | :--- | :--- | :--- | :--- |
| Native Deno | 71258.244474 | 1.31ms | 2.51ms | 100% |
| Fastro | 67407.897452 | 1.39ms | 2.68ms | 94.60% |

## Prerequisites
To run this benchmark locally, ensure you have:
1. [Deno](https://deno.land/) installed.
2. [k6](https://k6.io/) binary placed in the root directory as `./k6`.
3. Port 3000 available.
4. Execute the script: `bash run_bench.sh`.
