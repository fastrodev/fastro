---
description: Starting from v0.30.25, `fastro` has been rewritten to improve performance. 
---

# Benchmarks

Starting from v0.30.25, `fastro` has been rewritten to improve performance. 

Here are the test results for the [keep-alive connections](https://www.google.com/search?q=keep+alive+connection).

## Machine
- Prosesor: Intel® Core™ i7-6500U CPU @ 2.50GHz × 4
- Memory: 15,1 GiB 
- OS Name: Ubuntu 20.04.1 LTS

## Benchmarking tool
- [autocannon](https://www.npmjs.com/package/autocannon)

## Deno
- Source code: [deno_app.ts](https://github.com/fastrojs/fastro/blob/master/benchmarks/deno_app.ts)
- Run server: `deno run -A deno_app.ts`
- Benchmark command: `autocannon -c 100 http://localhost:8080`
- Result:
![](deno_app.svg)

## Fastro
- Source code: [fastro_app.ts](https://github.com/fastrojs/fastro/blob/master/benchmarks/fastro_app.ts)
- Run server: `deno run -A fastro_app.ts`
- Benchmark command: `autocannon -c 100 http://localhost:3000/hello`
- Result:  
![](fastro_app.svg)
