# Benchmarks

| Module | Version | Requests/sec | Percentage |
| ------ | ------: | -----------: | ---------: |
| Deno   | 0.132.0 |     23086.46 |   100.100% |
| Fastro |  0.38.0 |     22498.59 |     97.45% |

## Deno

```
wrk -t12 -c400 -d30s http://127.0.0.1:8000
```

```
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    17.23ms    5.06ms 197.37ms   98.69%
    Req/Sec     1.93k   189.42     2.56k    72.75%
  693731 requests in 30.05s, 100.56MB read
  Socket errors: connect 0, read 1011, write 1, timeout 0
Requests/sec:  23086.46
Transfer/sec:      3.35MB
```

## Fastro

```
wrk -t12 -c400 -d30s http://127.0.0.1:8000
```

```
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    17.66ms    5.02ms 183.24ms   95.85%
    Req/Sec     1.89k   227.43     2.65k    68.30%
  676085 requests in 30.05s, 96.71MB read
  Socket errors: connect 0, read 1074, write 2, timeout 0
Requests/sec:  22498.59
Transfer/sec:      3.22MB
```
