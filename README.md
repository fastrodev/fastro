# High-performance, minimalist web framework for Deno

![Fastro](https://repository-images.githubusercontent.com/264308713/1b83bd0f-b9d9-466d-9e63-f947c1a67281)

[![CI](https://github.com/fastrodev/fastro/actions/workflows/ci.yml/badge.svg)](https://github.com/fastrodev/fastro/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/fastrodev/fastro/badge.svg?branch=main)](https://coveralls.io/github/fastrodev/fastro?branch=main)

Fastro is a high-performance, zero-dependency web framework for Deno. It’s built for developers who care about **speed**, **type-safety**, and **clean code**.

- **Blazing Fast**: Reaches near-native Deno speeds [(Benchmarks)](/BENCHMARK.md).
- **Zero Dependency Core**: Minimalist engine with no external dependencies.
- **Zero Friction**: Return JSON, strings, or Responses directly.
- **Built to Scale**: Automatic [module loading](/DOCS.md#automatic-module-loading).
- **Rock Solid**: 100% core test coverage.

### Start in seconds

```ts
import Fastro from "https://deno.land/x/fastro/mod.ts";

const app = new Fastro();

app.get("/user/:id", (req, ctx) => {
  return { id: ctx.params.id, status: "active" };
});

app.serve({ port: 8000 });
```

### Convenience tasks (via `deno.json`):

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


### Resources

- Docs: https://fastro.deno.dev/DOCS.md
- Middlewares: https://fastro.deno.dev/MIDDLEWARES.md
- Benchmarks: https://fastro.deno.dev/BENCHMARK.md
- Contributing: https://fastro.deno.dev/CONTRIBUTING.md
