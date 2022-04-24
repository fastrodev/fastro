# Benchmarks

| Module                                                                          | Version | Requests/sec | Percentage |
| ------------------------------------------------------------------------------- | ------: | -----------: | ---------: |
| [Deno](https://github.com/fastrodev/fastro/blob/v0.51.0/benchmarks/deno.ts)     | 0.136.0 |     31686.46 |    100.00% |
| [Fastro](https://github.com/fastrodev/fastro/blob/v0.51.0/benchmarks/fastro.ts) |  0.51.0 |     29384.31 |     92.73% |

## Deno

```
wrk -t12 -c400 -d30s http://127.0.0.1:8000
```

```
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    12.59ms    3.95ms 168.21ms   98.53%
    Req/Sec     2.65k   241.41     3.99k    90.11%
  951667 requests in 30.03s, 137.95MB read
  Socket errors: connect 0, read 992, write 71, timeout 0
Requests/sec:  31686.46
Transfer/sec:      4.59MB
```

## Fastro

```
wrk -t12 -c400 -d30s http://127.0.0.1:8000
```

```
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    13.57ms    4.59ms 196.09ms   99.10%
    Req/Sec     2.46k   210.55     3.65k    89.77%
  882588 requests in 30.04s, 127.94MB read
  Socket errors: connect 0, read 1168, write 28, timeout 0
Requests/sec:  29384.31
Transfer/sec:      4.26MB
```
