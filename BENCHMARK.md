# Fastro Performance Benchmark

Generated on: Tue Feb  3 06:59:19 WIB 2026

| Scenario | Framework | Requests/sec | Avg Latency | p(95) Latency | % of Native |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Root | Native Deno | 53770.621953 | 1.74ms | 3.04ms | 100% |
| URL Params | Native Deno | 50236.107842 | 1.87ms | 3.19ms | 100% |
| Query Params | Native Deno | 50498.366139 | 1.86ms | 3.05ms | 100% |
| Middleware | Native Deno | 53567.635607 | 1.75ms | 2.92ms | 100% |
| JSON POST | Native Deno | 34245.080775 | 2.76ms | 4.53ms | 100% |
| Root | Fastro | 55326.359619 | 1.69ms | 3.13ms | 102.89% |
| URL Params | Fastro | 51417.319894 | 1.83ms | 3.47ms | 102.35% |
| Query Params | Fastro | 51302.28758 | 1.83ms | 3.3ms | 101.59% |
| Middleware | Fastro | 50491.495758 | 1.86ms | 3.44ms | 94.26% |
| JSON POST | Fastro | 32101.359123 | 2.96ms | 6.41ms | 93.74% |

## Prerequisites
To run this benchmark locally, ensure you have:
1. [Deno](https://deno.land/) installed.
2. [k6](https://k6.io/) binary placed in the root directory as `./k6`.
3. Port 3000 available.
4. Execute the script: `bash run_bench.sh`.
