# High-performance, minimalist web framework for Deno

![Fastro](https://repository-images.githubusercontent.com/264308713/1b83bd0f-b9d9-466d-9e63-f947c1a67281)

[![Deno](https://img.shields.io/badge/deno-2.7.4-blue?logo=deno&logoColor=white)](https://deno.land/)
[![License](https://img.shields.io/github/license/fastrodev/fastro)](https://github.com/fastrodev/fastro/blob/main/LICENSE)
[![Release](https://img.shields.io/github/v/release/fastrodev/fastro)](https://github.com/fastrodev/fastro/releases)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](https://github.com/fastrodev/fastro/blob/main/BENCHMARK.md)
[![Performance](https://img.shields.io/badge/performance-95.92%25_of_native-orange)](https://github.com/fastrodev/fastro/blob/main/BENCHMARK.md)

Fastro is a **blazing-fast**, **type-safe**, and **zero-dependency** web framework meticulously engineered for Deno. It is built for developers who demand peak performance without sacrificing a clean and intuitive developer experience.

### 🚀 **Engineered for Speed**  
Achieve near-native Deno throughput. Powered by our latest **pre-built middleware chains** and **unified cache fast-path**, Fastro eliminates dispatch overhead, ensuring your application remains responsive under extreme load. [(Benchmarks)](/BENCHMARK.md)

### 💎 **Zero-Friction DX**  
Write clean, declarative code. Return JSON objects, strings, or native Responses directly from your handlers. No boilerplate, no complex abstractions—just pure productivity.

### 📦 **Zero Dependency Core**  
A minimalist, rock-solid engine with absolutely no external dependencies. Keep your stack light, secure, and easy to maintain.

### 🏙️ **Built to Scale**  
Easily manage complex architectures with [automatic module loading](https://fastro.deno.dev/DOCS.md#automatic-module-loading) and a modular design that grows with your application.

### 🛡️ **Rock Solid Reliability**  
Deploy with absolute confidence. Fastro guarantees industrial-grade stability with **100% branch and line coverage** across the entire project core.

### ⚡ Quick Start

```ts
import Fastro from "https://deno.land/x/fastro/mod.ts";

const app = new Fastro();

app.get("/user/:id", (req, ctx) => {
  return { id: ctx.params.id, status: "active" };
});

app.serve({ port: 8000 });
```

### 🛠️ Convenience tasks (via `deno.json`):

- Start the app:  
  ```bash 
  deno task start
  ```
- Run the local benchmark script (requires `k6`):  
  ```bash  
  deno task bench
  ```
- Run the test suite:  
  ```bash 
  deno task test
  ```
- Produce LCOV coverage:   
  ```bash 
  deno task cov
  ```


### 📚 Resources

- Docs: https://fastro.deno.dev/DOCS.md
- Middlewares: https://fastro.deno.dev/MIDDLEWARES.md
- Benchmarks: https://fastro.deno.dev/BENCHMARK.md
- Contributing: https://fastro.deno.dev/CONTRIBUTING.md
