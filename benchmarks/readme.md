# Benchmarks

| module  | version | requests/sec |
| ------- | ------: | -----------: |
| node    |  17.7.2 |     38939.08 |
| deno    |  1.20.1 |     32394.14 |
| fastro  |  0.35.0 |     30051.03 |
| express |  4.17.3 |      7948.40 |

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
    Latency    12.24ms    3.15ms 154.45ms   99.01%
    Req/Sec     2.72k   340.41    15.94k    98.86%
  975192 requests in 30.10s, 140.43MB read
  Socket errors: connect 0, read 1107, write 0, timeout 0
Requests/sec:  32394.14
Transfer/sec:      4.66MB
```

## node

```
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    10.14ms    1.97ms  95.62ms   98.00%
    Req/Sec     3.26k   275.03     3.97k    96.03%
  1168629 requests in 30.01s, 149.34MB read
  Socket errors: connect 0, read 1118, write 0, timeout 0
Requests/sec:  38939.08
Transfer/sec:      4.98MB
```

## fastro

```
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    13.23ms    3.63ms 169.76ms   99.19%
    Req/Sec     2.52k   135.33     3.34k    97.53%
  902550 requests in 30.03s, 129.97MB read
  Socket errors: connect 0, read 1204, write 4, timeout 0
Requests/sec:  30051.03
Transfer/sec:      4.33MB
```

## express

```
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    49.71ms    6.45ms 231.12ms   94.81%
    Req/Sec   666.74     64.53   838.00     89.37%
  238764 requests in 30.04s, 54.42MB read
  Socket errors: connect 0, read 1281, write 0, timeout 0
Requests/sec:   7948.40
Transfer/sec:      1.81MB
```
