# Fastro Framework

[![build](https://github.com/fastrodev/fastro/actions/workflows/build.yml/badge.svg)](https://github.com/fastrodev/fastro/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/fastrodev/fastro/badge.svg?branch=main)](https://coveralls.io/github/fastrodev/fastro?branch=main)

![Fastro](https://repository-images.githubusercontent.com/264308713/45a53a9a-141e-4204-8f0b-4867c05cbc0d)

## The Fast, Simple, and Scalable Web Framework for Deno

Fastro is engineered for developers who refuse to compromise. It combines **extreme performance** with an **elegant API**, allowing you to build high-throughput microservices and web applications without the friction of traditional frameworks.

### Why Fastro?

- **Blazing Fast**: Optimized to reach near-native Deno speeds. [Compare the results](BENCHMARK.md).
- **Zero Friction**: Return [JSON, strings, or Responses](DOCS.md#responses) directly. No boilerplate, just code.
- **Ultra Lightweight**: Zero external dependencies. Built entirely on [Deno standards](https://deno.land).
- **Built to Scale**: [Automatic module loading](DOCS.md#automatic-module-loading) for complex applications.
- **Rock Solid**: [100% test coverage](https://coveralls.io/github/fastrodev/fastro?branch=main) and [first-class TypeScript support](https://www.typescriptlang.org/).

## Quick Start

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

## Resources

- [**Get Started**](DOCS.md) - Comprehensive documentation and API reference.
- [**Benchmarks**](BENCHMARK.md) - See how Fastro crushes performance tests.
- [**Middleware**](MIDDLEWARES.md) - Explore the ecosystem and official plugins.
- [**Showcase**](SHOWCASE.md) - See what others are building with Fastro.
- [**Contribute**](CONTRIBUTING.md) - Help us build the future of Deno web development.