# Fastro

A high-performance, minimalist web framework for Deno.

Fastro is designed for speed and simplicity, providing a robust middleware
engine, LRU route caching, and a developer-friendly API that supports returning
raw strings directly from handlers.

## Features

- ⚡ **High Performance**: Optimized route matching with internal LRU caching
  for maximum throughput.
- 🧩 **Middleware Engine**: Support for global, router-level, and route-specific
  middleware. Users can easily manipulate the request or context before it
  reaches the handler.
- 📂 **Auto Module Loading**: Effortlessly register routes and middlewares from
  any directory.
- 📝 **Flexible API**: Return `string`, `Response`, `JSON`, or `Promise` of
  either directly from your handlers.
- 🔒 **Type Safety**: Built with TypeScript for a robust developer experience.
- 🧪 **100% Test Coverage**: Core components are fully verified with exhaustive
  unit tests.
- 📊 **Benchmarking First**: Includes built-in tools to measure performance
  against native Deno.

## Quick Start

```ts
import server from "./mod.ts";

// Return a direct string - Fastro handles the Response conversion
server.get("/", () => "Hello World!");

// Async support
server.get("/async", async () => {
  return "Hello from async!";
});

// Middleware to manipulate request/context
server.use((req, ctx, next) => {
  ctx.set("time", Date.now());
  return next();
});

await server.serve({ port: 8000 });
```

## Performance Benchmarks

Conducted using **Grafana k6** with 100 concurrent virtual users for 10 seconds.

| Metric                  | Native Deno   | Fastro Framework  |
| :---------------------- | :------------ | :---------------- |
| **Requests per Second** | ~79,700 req/s | **~67,200 req/s** |
| **Average Latency**     | 1.17 ms       | **1.40 ms**       |
| **95th Percentile**     | 2.19 ms       | **2.36 ms**       |

> _Fastro maintains ~84% of native performance while adding full framework
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
