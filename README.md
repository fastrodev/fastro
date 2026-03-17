# High-performance, minimalist web framework for Deno

![Fastro](https://repository-images.githubusercontent.com/264308713/1b83bd0f-b9d9-466d-9e63-f947c1a67281)

[![Deno](https://img.shields.io/badge/deno-2.7.4-blue?logo=deno&logoColor=white)](https://deno.land/)
[![License](https://img.shields.io/github/license/fastrodev/fastro)](https://github.com/fastrodev/fastro/blob/main/LICENSE)
[![Release](https://img.shields.io/github/v/release/fastrodev/fastro)](https://github.com/fastrodev/fastro/releases)
[![Coverage Status](https://coveralls.io/repos/github/fastrodev/fastro/badge.svg?branch=main)](https://coveralls.io/github/fastrodev/fastro?branch=main)
[![Performance](https://img.shields.io/badge/performance-up_to_116%25_of_native-brightgreen)](https://github.com/fastrodev/fastro/blob/main/BENCHMARK.md)

Fastro is a **blazing-fast** and **type-safe** web framework for Deno that delivers **engineered speed**, **zero-friction DX**, and a **zero-dependency core** with **rock-solid reliability**.

### 🚀 Quick Start

```ts
import Fastro from "https://deno.land/x/fastro/mod.ts";

const app = new Fastro();

app.get("/user/:id", (req, ctx) => {
  return { id: ctx.params.id, status: "active" };
});

app.serve({ port: 8000 });
```

### 🛠️ Convenience tasks:

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

- [Docs](https://fastro.deno.dev/DOCS.md)
- [Middlewares](https://fastro.deno.dev/MIDDLEWARES.md)
- [Benchmarks](https://fastro.deno.dev/BENCHMARK.md)
- [Contributing](https://fastro.deno.dev/CONTRIBUTING.md)