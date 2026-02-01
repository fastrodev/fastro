# Fastro Performance Benchmark

Generated on: Sun Feb  1 10:32:24 WIB 2026

| Framework | Requests/sec | Avg Latency | p(95) Latency | % of Native |
| :--- | :--- | :--- | :--- | :--- |
| Native Deno | 81906.976776 | 1.14ms | 2.13ms | 100% |
| Fastro | 77654.560745 | 1.21ms | 2.2ms | 94.81% |

## Prerequisites
To run this benchmark locally, ensure you have:
1. [Deno](https://deno.land/) installed.
2. [k6](https://k6.io/) binary placed in the root directory as `./k6`.
3. Port 3000 available.
4. Execute the script: `bash run_bench.sh`.
