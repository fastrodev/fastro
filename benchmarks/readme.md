# Benchmarks

## Machine
- Prosesor: Intel® Core™ i5-3320M CPU @ 2.60GHz × 4
- Memory: 15,3 GiB 
- OS Name: Ubuntu 20.04.1 LTS

## Benchmarking tool
- [autocannon](https://www.npmjs.com/package/autocannon)

## Deno
- Source code: [deno_app.ts](deno_app.ts)
- Run server: `deno run -A deno_app.ts`
- Benchmark command: `autocannon -c 100 http://localhost:8080`
- Result:
  
  ![](deno_app.svg)

## Fastro
- Source code: [fastro_app.ts](fastro_app.ts)
- Run server: `deno run -A fastro_app.ts`
- Benchmark command: `autocannon -c 100 http://localhost:3000/hello`
- Result:
  
  ![](fastro_app.svg)