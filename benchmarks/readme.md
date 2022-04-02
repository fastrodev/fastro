# Benchmarks

| Module | Version | Requests/sec | Percentage |
| ------ | ------: | -----------: | ---------: |
| Deno   | 0.133.0 |     32553.98 |    100.00% |
| Fastro |  0.45.0 |     30187.11 |     92.73% |

## Deno

```
wrk -t12 -c400 -d30s http://127.0.0.1:8000
```

```
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    12.05ms    2.10ms 137.88ms   96.53%
    Req/Sec     2.73k   161.41     4.01k    92.03%
  977758 requests in 30.03s, 141.73MB read
  Socket errors: connect 0, read 891, write 3, timeout 0
Requests/sec:  32553.98
Transfer/sec:      4.72MB
```

## Fastro

```
wrk -t12 -c400 -d30s http://127.0.0.1:8000
```

```
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    13.16ms    3.62ms 164.66ms   98.89%
    Req/Sec     2.53k   215.04     7.26k    97.72%
  906681 requests in 30.04s, 129.70MB read
  Socket errors: connect 0, read 435, write 107, timeout 0
Requests/sec:  30187.11
Transfer/sec:      4.32MB
```
