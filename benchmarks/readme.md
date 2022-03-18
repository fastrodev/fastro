# Benchmarks

| module | version | requests/sec | transfer/sec | percentage |
| ------ | ------: | -----------: | -----------: | ---------: |
| deno   | 0.130.0 |     28853.41 |       4.16MB |    100.00% |
| fastro |  0.34.0 |     27816.33 |       4.01MB |     96.40% |

## machine

- MacBook Pro (13-inch, 2020)
- 2 GHz Quad-Core Intel Core i5
- 16 GB 3733 MHz LPDDR4X

## deno version

- 1.120.1

## wrk

```
wrk -t12 -c400 -d30s http://127.0.0.1:8000
```

## deno (std@0.129.0)

```
deno run -A benchmarks/deno.ts
```

Result

```
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    13.79ms    3.96ms 164.00ms   98.36%
    Req/Sec     2.42k   173.83     3.26k    92.53%
  866557 requests in 30.03s, 124.79MB read
  Socket errors: connect 0, read 1310, write 0, timeout 0
Requests/sec:  28853.41
Transfer/sec:      4.16MB
```

## fastro (v0.33.1)

```
deno run -A benchmarks/fastro.ts
```

Result

```
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    14.29ms    3.59ms 164.05ms   99.03%
    Req/Sec     2.33k   120.75     3.23k    94.61%
  835052 requests in 30.02s, 120.25MB read
  Socket errors: connect 0, read 1171, write 0, timeout 0
Requests/sec:  27816.33
Transfer/sec:      4.01MB
```
