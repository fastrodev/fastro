# High-performance, minimalist web framework for Deno

![Fastro](https://repository-images.githubusercontent.com/264308713/1b83bd0f-b9d9-466d-9e63-f947c1a67281)

[![build](https://github.com/fastrodev/fastro/actions/workflows/build.yml/badge.svg)](https://github.com/fastrodev/fastro/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/fastrodev/fastro/badge.svg?branch=main)](https://coveralls.io/github/fastrodev/fastro?branch=main)

Fastro combines **extreme performance** with an **elegant API**. Built for high-throughput services without the boilerplate.

- **Blazing Fast**: Reaches near-native Deno speeds ([Benchmarks](BENCHMARK.md)).
- **Zero Dependency Core**: Minimalist engine with no external dependencies.
- **Zero Friction**: Return JSON, strings, or Responses directly.
- **Built to Scale**: Automatic [module loading](DOCS.md#automatic-module-loading).
- **Rock Solid**: 100% core test coverage.

## Quick Start

![Fastro Start](https://storage.googleapis.com/replix-394315-file/uploads/start.jpg)

Build a high-performance API in seconds with zero boilerplate.

```ts
import Fastro from "https://deno.land/x/fastro/mod.ts";
const app = new Fastro();

app.get("/user/:id", (req, ctx) => {
  return { id: ctx.params.id, status: "active" };
});

await app.serve({ port: 8000 });
```

## Resources

![Fastro Resources](https://storage.googleapis.com/replix-394315-file/uploads/resources.jpg)

Explore our comprehensive documentation, benchmarks, and community ecosystem.

- [**Docs**](DOCS.md) – Comprehensive guide and API reference.
- [**Showcase**](SHOWCASE.md) – Real-world examples built with Fastro.
- [**Middlewares**](MIDDLEWARES.md) – Official plugins and community ecosystem.
- [**Benchmarks**](BENCHMARK.md) – Performance comparisons and results.
- [**Contribute**](CONTRIBUTING.md) – Join us in building the future of Deno.
