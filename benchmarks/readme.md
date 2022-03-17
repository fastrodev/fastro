# Benchmarks

## Perfomance
- 92,89% from deno

## Machine
- MacBook Pro (13-inch, 2020)
- 2 GHz Quad-Core Intel Core i5
- 16 GB 3733 MHz LPDDR4X

## wrk
```
wrk -t12 -c400 -d30s http://127.0.0.1:8000
```


## fastro
```
deno run -A benchmarks/fastro.ts
```

Result
```
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    12.40ms    3.70ms 162.20ms   99.33%
    Req/Sec     2.69k   147.41     3.62k    98.22%
  963768 requests in 30.03s, 117.65MB read
  Socket errors: connect 0, read 1242, write 0, timeout 0
Requests/sec:  32098.61
Transfer/sec:      3.92MB
```

## deno
```
deno run -A benchmarks/deno.ts
```
Result
```
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    11.50ms    3.05ms 146.83ms   99.29%
    Req/Sec     2.89k   153.87     3.54k    97.83%
  1037772 requests in 30.03s, 126.68MB read
  Socket errors: connect 0, read 1142, write 0, timeout 0
Requests/sec:  34554.26
Transfer/sec:      4.22MB
```