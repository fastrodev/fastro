# ⚡️ Fastro

[![build](https://github.com/fastrodev/fastro/actions/workflows/build.yml/badge.svg)](https://github.com/fastrodev/fastro/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/fastrodev/fastro/badge.svg?branch=main)](https://coveralls.io/github/fastrodev/fastro?branch=main)

![Fastro](https://repository-images.githubusercontent.com/264308713/45a53a9a-141e-4204-8f0b-4867c05cbc0d)

## The High-Performance Web Framework for the Modern TypeScript Era

Fastro is the bridge between **raw Deno performance** and **elite developer
experience**. Stop compromising between speed and simplicity. Build secure,
scalable APIs with zero boilerplate and maximum throughput.

## 🚀 Why Fastro?

- **💨 Near-Native Performance**: Benchmark-proven to maintain **exceptional
  efficiency**, often reaching or exceeding raw Deno performance. Stop choosing
  between DX and speed.
- **✨ Zero-Boilerplate API**: Return `string`, `JSON`, or `Response` directly.
  No more `.send()` or `.json()` boilerplate.
- **🛡️ Lean & Secure**: Zero external dependencies. Built strictly on top-tier
  Deno standards.
- **🏗️ Scaling-First Design**: Advanced directory-based module loading keeps
  your project organized as you grow.
- **💎 Rock-Solid Core**: 100% test coverage and deep TypeScript integration
  ensure your app stays stable from dev to production.


## ✨ Features

- **Blazing Fast Routing**: Optimized pattern matching with intelligent LRU
  caching for high-traffic applications.
- **Modern Middleware**: Seamless global, router, and route-level middleware
  with a familiar async/await flow.
- **Auto-Loading Modules**: Register entire directories of functionality with a
  single command—perfect for large-scale apps.
- **Type-Safe by Default**: Enjoy best-in-class IDE integration and compile-time
  safety tailored for TypeScript developers.
- **Benchmark-First**: Built-in verification tools to ensure your application
  remains as fast as native Deno.


## 📊 Performance That Matters

Benchmarks vary by environment, and results may fluctuate depending on system resources and load during execution. Fastro consistently delivers near-native speeds and high efficiency.

Below are typical results using **Grafana k6** (100 VUs, 10s) for the root endpoint:

| Metric                  | Native Deno    | Fastro Framework   |
| :---------------------- | :------------- | :----------------- |
| **Requests per Second** | ~63,000+ req/s | **~68,000+ req/s** |
| **Average Latency**     | ~1.49 ms       | **~1.36 ms**       |
| **95th Percentile**     | ~2.79 ms       | **~2.55 ms**       |

> _"Fastro provides a complete developer-friendly abstraction without
> sacrificing the performance advantages of Deno."_

Fastro typically maintains **93-118%** efficiency compared to native Deno across
multiple scenarios, including URL parameters, Middleware, and JSON POST.

Check the [detailed benchmark report](BENCHMARK.md).


## 🛠️ Quick Start

Build and serve your first app in seconds with zero configuration:

```ts
import Fastro from "./mod.ts";

const app = new Fastro();

// Simple string response
app.get("/", () => "Welcome to Fastro!");

// Automatic JSON serialization & Type Safety
app.get("/user/:id", async (req, ctx) => {
  return { id: ctx.params.id, status: "active" };
});

// Powerful, predictable middleware
app.use((req, ctx, next) => {
  ctx.startTime = Date.now();
  return next();
});

await app.serve({ port: 8000 });
```


## 📖 Documentation

Master Fastro in minutes with our [comprehensive guide](DOCS.md), covering
everything from routing to deep-level middleware.


## 🏗️ Development

Ready to build? Test your implementation with our built-in tools:

```bash
# Run the test suite
deno task test

# Generate a 100% coverage report
deno task cov

# Run local performance benchmark
deno task bench
```


## 🤝 Community & Contributing

Fastro is a community-driven project. We're looking for passionate developers to
help shape the future of high-performance web development.

- **Explore & Contribute**: Visit our [Middleware Collection](MIDDLEWARES.md)
  and add your own logic!
- **Showcase Your Work**: Share what you've built in our [Showcase](SHOWCASE.md)
  and inspire others.
- **Join the Core**: Check our [Contributing Guide](CONTRIBUTING.md) to start
  fixing bugs or suggesting features.
- **Get Help**: Have a question?
  [Open an issue](https://github.com/fastrodev/fastro/issues) or join the
  discussion.
