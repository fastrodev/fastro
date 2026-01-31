# Fastro

A high-performance, minimalist web framework for Deno.

Fastro is designed for speed and simplicity, providing a robust middleware
engine, LRU route caching, and a developer-friendly API that supports returning
raw strings directly from handlers.

## Features

- ⚡ **High Performance**: Optimized route matching and internal LRU caching.
- 🧩 **Middleware Engine**: Flexible global and route-specific middleware
  support.
- 📦 **Auto Module Loading**: Automatically discover and register middlewares
  from the `modules/` directory.
- 📝 **Friendly API**: Return `string`, `Response`, or `Promise` of either.
- 🧪 **100% Test Coverage**: Fully tested core with exhaustive edge-case
  handling.

## Quick Start

```ts
import server from "./mod.ts";

// Return a direct string - Fastro handles the Response conversion
server.get("/", () => "Hello World!");

// Async support
server.get("/async", async () => {
  return "Hello from async!";
});

await server.serve({ port: 8000 });
```

## Performance Benchmarks

Conducted using **Grafana k6** with 100 concurrent virtual users for 10 seconds.

| Metric                  | Native Deno   | Fastro Framework  |
| :---------------------- | :------------ | :---------------- |
| **Requests per Second** | ~76,600 req/s | **~61,100 req/s** |
| **Average Latency**     | 1.34 ms       | **1.54 ms**       |
| **95th Percentile**     | 2.52 ms       | **2.74 ms**       |

> _Fastro maintains ~80% of native performance while adding full framework
> capabilities._

## Development

### Tasks

```bash
# Run tests
deno task test

# Run tests with coverage report
deno task cov

# Run performance benchmark
deno task bench
```
