---
date: 2021-01-25 12:06:01
layout: default
---

# Benchmarks

## Machine
- Prosesor: Intel® Core™ i7-6500U CPU @ 2.50GHz × 4
- Memory: 15,1 GiB 
- OS Name: Ubuntu 20.04.1 LTS

## Benchmarking tool
- [autocannon](https://www.npmjs.com/package/autocannon)

## Deno
- Source code: [deno_app.ts](https://github.com/fastrojs/fastro/blob/master/benchmark/deno_app.ts)
- Run server: `deno run -A benchmarks/deno_app.ts`
- Benchmark command: `autocannon -c 100 http://localhost:8080`
- Result:
  ![](deno_app.svg)

## Fastro
- Source code: [fastro_app.ts](https://github.com/fastrojs/fastro/blob/master/benchmark/fastro_app.ts)
- Run server: `deno run -A benchmarks/fastro_app.ts`
- Benchmark command: `autocannon -c 100 http://localhost:3000/hello`
- Result:
  ![](fastro_app.svg)
