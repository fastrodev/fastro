# Benchmarks

| Module                                                                          | Version | Requests/sec | Percentage |
| ------------------------------------------------------------------------------- | ------: | -----------: | ---------: |
| [Deno](https://github.com/fastrodev/fastro/blob/v0.59.0/benchmarks/deno.ts)     | 0.140.0 |    32877.59  |    100.00% |
| [Fastro](https://github.com/fastrodev/fastro/blob/v0.59.0/benchmarks/fastro.ts) |  0.59.0 |     30242.40 |     91.98% |

## Deno

```
wrk -t12 -c400 -d30s http://127.0.0.1:8000
```

```
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    12.14ms    3.57ms 147.32ms   98.38%
    Req/Sec     2.75k   241.15     3.92k    94.58%
  987853 requests in 30.05s, 143.20MB read
  Socket errors: connect 0, read 836, write 8, timeout 0
Requests/sec:  32877.59
Transfer/sec:      4.77MB
```

## Fastro

```
wrk -t12 -c400 -d30s http://127.0.0.1:8000
```

```
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    13.20ms    3.96ms 164.72ms   97.91%
    Req/Sec     2.53k   240.17     3.90k    94.78%
  908500 requests in 30.04s, 131.69MB read
  Socket errors: connect 0, read 1016, write 15, timeout 0
Requests/sec:  30242.40
Transfer/sec:      4.38MB
```
