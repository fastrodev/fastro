# ⚡ Fastro Framework

### **The Ultra-Fast, Minimalist Web Framework for Deno.**

Fastro bridges the gap between raw Deno performance and elite developer
experience. Built for speed, security, and simplicity, it features a robust
middleware engine, intelligent LRU caching, and a zero-boilerplate API.

---

## 🚀 Why Fastro?

- **🏎️ Maximum Throughput**: Benchmark-proven to maintain **>95% of raw Deno
  performance**. Stop choosing between DX and speed.
- **✨ Intuitive API**: Return `string`, `JSON`, or `Response` directly. No more
  `.send()` or `.json()` boilerplate.
- **📦 Lean & Secure**: Zero external dependencies. Built strictly on top-tier
  Deno standards.
- **🏗️ Organized Scaling**: Advanced directory-based module loading keeps your
  project clean as you grow.
- **🛡️ Rock-Solid Core**: 100% test coverage and first-class TypeScript support
  ensure your app stays stable.

---

## ✨ Features

- **⚡ Blazing Fast Routing**: Optimized pattern matching with intelligent LRU
  caching for high-traffic apps.
- **🧩 Flexible Middleware**: Seamless global, router, and route-level
  middleware with an async/await flow you already know.
- **📂 Auto-Loading Modules**: Register entire directories of functionality with
  a single command.
- **🔒 Type-Safe by Default**: Enjoy deep IDE integration and compile-time
  safety.
- **📊 Benchmark-First**: Built-in verification tools to ensure your app stays
  as fast as native Deno.

---

## 📊 Performance That Matters

Don't take our word for it. Benchmarks conducted using **Grafana k6** (100 VUs,
10s):

| Metric                  | Native Deno   | Fastro Framework  |
| :---------------------- | :------------ | :---------------- |
| **Requests per Second** | ~81,900 req/s | **~77,600 req/s** |
| **Average Latency**     | 1.14 ms       | **1.21 ms**       |
| **95th Percentile**     | 2.13 ms       | **2.20 ms**       |

> _"Fastro provides a complete developer-friendly abstraction without
> sacrificing the performance advantages of Deno."_

Check the [detailed benchmark report](BENCHMARK.md).

---

## 🏁 Quick Start

Build and serve your first app in seconds:

```ts
import Fastro from "./mod.ts";

const app = new Fastro();

// Simple string response
app.get("/", () => "Welcome to Fastro!");

// Automatic JSON serialization
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

---

## 📖 Documentation

Master Fastro in minutes with our [comprehensive guide](DOCS.md), covering
everything from routing to deep-level middleware.

---

## 🛠️ Development

Get involved or test it yourself:

```bash
# Run the test suite
deno task test

# Generate a 100% coverage report
deno task cov

# Run local performance benchmark
deno task bench
```

---

## 🤝 Community & Contributing

Fastro thrives on your ideas! Whether you're fixing a bug, suggesting a feature,
or writing a custom middleware, we welcome your contributions.

- **Explore our [Middleware Collection](/MIDDLEWARES.md)** and add yours!
- **Share your creations in our [Showcase](/SHOWCASE.md)** and inspire the
  community!
- **Check out our [Contributing Guide](CONTRIBUTING.md)** for details on
  creating middlewares and development workflows.
- Have a question? [Open an issue](https://github.com/fastrodev/fastro/issues).
