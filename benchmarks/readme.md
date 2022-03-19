# Benchmarks

| module  | version | requests/sec | percentage |
| ------- | ------: | -----------: | ---------: |
| deno    | 0.130.0 |     32520.95 |    100.00% |
| node    |  17.7.2 |     31903.86 |     98.10% |
| fastro  |  0.35.0 |     30616.32 |     94.14% |
| express |  4.17.3 |      7896.85 |     24.28% |

## machine

- MacBook Pro (13-inch, 2020)
- 2 GHz Quad-Core Intel Core i5
- 16 GB 3733 MHz LPDDR4X

## wrk

```
wrk -t12 -c400 -d30s http://127.0.0.1:8000
```

## deno

```
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    12.24ms    3.34ms 151.36ms   98.34%
    Req/Sec     2.72k   187.58     3.58k    95.08%
  976263 requests in 30.02s, 140.59MB read
  Socket errors: connect 0, read 1253, write 0, timeout 0
Requests/sec:  32520.95
Transfer/sec:      4.68MB
```

## node

```
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    12.44ms    3.22ms 109.63ms   90.88%
    Req/Sec     2.68k   420.07     3.27k    73.82%
  957808 requests in 30.02s, 122.40MB read
  Socket errors: connect 0, read 1409, write 0, timeout 0
Requests/sec:  31903.86
Transfer/sec:      4.08MB
```

## fastro

```
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    13.00ms    3.90ms 174.77ms   99.20%
    Req/Sec     2.56k   153.64     3.29k    97.33%
  918993 requests in 30.02s, 132.34MB read
  Socket errors: connect 0, read 1274, write 3, timeout 0
Requests/sec:  30616.32
Transfer/sec:      4.41MB
```

## express

```
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    50.09ms    6.98ms 257.07ms   94.99%
    Req/Sec   661.59     66.97   808.00     89.05%
  237188 requests in 30.04s, 54.06MB read
  Socket errors: connect 0, read 1215, write 0, timeout 0
Requests/sec:   7896.85
Transfer/sec:      1.80MB
```
