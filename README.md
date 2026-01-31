# ⚡ Fastro

### **High-performance, minimalist web framework for Deno.**

Fastro bridges the gap between raw Deno performance and framework-level
developer experience. Built for speed and simplicity, it features a robust
middleware engine, intelligent LRU caching, and a zero-boilerplate API.

---

## 🚀 Why Fastro?

- **Native Speed**: Benchmark-proven to maintain **>95% of raw Deno
  performance**.
- **Effortless API**: Return raw `string`, `JSON`, or `Response` directly—no
  more wrapping everything in `.send()`.
- **Minimalist Footprint**: Tiny core with zero external dependencies (built
  solely on Deno standards).
- **Scale with Ease**: Automatic directory-based module loading keeps your
  codebase clean as you grow.
- **Built for Production**: 100% core test coverage and first-class TypeScript
  support.

---

## ✨ Features

- ⚡ **Blazing Fast**: Optimized route matching and LRU caching for maximum
  throughput.
- 🧩 **Flexible Middleware**: Global, router-level, and route-specific
  middleware with a familiar async/await flow.
- 📂 **Auto Module Loading**: Effortlessly register routes and middlewares from
  your directory structure.
- 🔒 **Type-Safe by Design**: Leverage TypeScript to catch errors at compile
  time.
- 🧪 **Verified Reliability**: 100% unit test coverage ensures your core logic
  stays stable.
- 📊 **Benchmark-First Culture**: Includes built-in tools to verify results
  against native Deno.

---

## 🏁 Quick Start

```ts
import server from "./mod.ts";

// Simple string response - Fastro handles the heavy lifting
server.get("/", () => "Welcome to Fastro!");

// Modern async handlers
server.get("/user/:id", async (req, ctx) => {
  return { id: ctx.params.id, status: "active" }; // Automatically sent as JSON
});

// Powerful, predictable middleware
server.use((req, ctx, next) => {
  ctx.startTime = Date.now();
  return next();
});

await server.serve({ port: 8000 });
```

---

## 📊 Performance Benchmarks

Conducted using **Grafana k6** with 100 concurrent virtual users for 10 seconds.

| Metric                  | Native Deno   | Fastro Framework  |
| :---------------------- | :------------ | :---------------- |
| **Requests per Second** | ~76,000 req/s | **~72,800 req/s** |
| **Average Latency**     | 1.23 ms       | **1.29 ms**       |
| **95th Percentile**     | 2.37 ms       | **2.29 ms**       |

> _Fastro maintains industry-leading performance while providing a complete
> developer-friendly abstraction._

---

## 🛠️ Development

### Tasks

```bash
# Run the test suite
deno task test

# Generate a 100% coverage report
deno task cov

# Run local performance benchmark
deno task bench
```
