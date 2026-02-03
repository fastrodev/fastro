# ⚡Fastro Framework

[![build](https://github.com/fastrodev/fastro/actions/workflows/build.yml/badge.svg)](https://github.com/fastrodev/fastro/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/fastrodev/fastro/badge.svg?branch=main)](https://coveralls.io/github/fastrodev/fastro?branch=main)

![Fastro](https://repository-images.githubusercontent.com/264308713/45a53a9a-141e-4204-8f0b-4867c05cbc0d)

## High-Performance Web Framework for Deno

Fastro is the bridge between **raw Deno performance** and **elite developer experience**. Build secure, scalable APIs with zero boilerplate and maximum throughput.

### 🚀 Key Features
- **💨 Near-Native**: Reaches or exceeds raw Deno performance (~68k+ req/s).
- **✨ Zero-Boilerplate**: Return `string`, `JSON`, or `Response` directly.
- **🛡️ Lean**: Zero external dependencies, built on Deno standards.
- **🏗️ Scaling**: Directory-based module loading for large-scale apps.
- **💎 Solid**: 100% test coverage and deep TypeScript integration.

## 🛠️ Quick Start

```ts
import Fastro from "https://deno.land/x/fastro/mod.ts";

const app = new Fastro();

// Simple GET with URL parameters
app.get("/user/:id", (req, ctx) => {
  return { id: ctx.params.id, status: "active" };
});

// Powerful middleware
app.use((req, ctx, next) => {
  console.log(`${req.method} ${ctx.url.pathname}`);
  return next();
});

await app.serve({ port: 8000 });
```

## 📊 Performance

| Metric | Native Deno | Fastro |
| :--- | :--- | :--- |
| **Requests/s** | ~63,000+ | **~68,000+** |
| **Latency** | ~1.49 ms | **~1.36 ms** |

## 📖 Useful Links
- [Documentation](DOCS.md) - Full guide and API reference.
- [Benchmarks](BENCHMARK.md) - Detailed performance reports.
- [Middlewares](MIDDLEWARES.md) - Official and community collection.
- [Contributing](CONTRIBUTING.md) - Join the development.