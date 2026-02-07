# The Fast, Simple, and Scalable Web Framework for Deno

![Fastro](https://repository-images.githubusercontent.com/264308713/1b83bd0f-b9d9-466d-9e63-f947c1a67281)

[![build](https://github.com/fastrodev/fastro/actions/workflows/build.yml/badge.svg)](https://github.com/fastrodev/fastro/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/fastrodev/fastro/badge.svg?branch=main)](https://coveralls.io/github/fastrodev/fastro?branch=main)

Fastro is engineered for developers who refuse to compromise. It combines **extreme performance** with an **elegant API**, allowing you to build high-throughput microservices and web applications without the friction of traditional frameworks.

### Why Fastro?

- **Blazing Fast**: Optimized to reach near-native Deno speeds. [Compare the results](BENCHMARK.md).
- **Zero Friction**: Return [JSON, strings, or Responses](DOCS.md#responses) directly. No boilerplate, just code.
- **Ultra Lightweight**: Zero external dependencies. Built entirely on [Deno standards](https://deno.land).
- **Built to Scale**: [Automatic module loading](DOCS.md#automatic-module-loading) for complex applications.
- **AI-Driven Optimization**: Since v1, we've extensively leveraged AI to fine-tune performance and achieve a rigorous [100% test coverage](https://coveralls.io/github/fastrodev/fastro?branch=main).
- **Rock Solid**: First-class TypeScript support and production-ready stability.

## Quick Start

Create a high-performance server with zero friction:

```typescript
import Fastro from "https://deno.land/x/fastro/mod.ts";

const app = new Fastro();

app.get("/user/:id", (req, ctx) => {
  return { id: ctx.params.id, status: "active" };
});

app.use((req, ctx, next) => {
  console.log(`${req.method} ${ctx.url.pathname}`);
  return next();
});

await app.serve({ port: 8000 });
```


### Rendering with React & esbuild

Fastro makes full-stack development feel native to Deno:

```tsx
// Simple React SSR with esbuild
app.get("/", (req, ctx) => {
  // Use `renderToString` and wrap result in a Response
  const html = ctx.renderToString!(<MyReactComponent />);
  return new Response(html, { headers: { "Content-Type": "text/html" } });
});

```


### Performance & Reliability Comparison

| Feature | Fastro | Others |
| --- | --- | --- |
| **Throughput** | **~50,000 req/s** | < 45,000 req/s |
| **Test Coverage** | **100.0%** | ~80% |
| **Core Dependencies** | **0 (None)** | Multiple |
| **Rendering** | **React + esbuild** | Custom/Complex |

## Resources

- [**Showcase**](SHOWCASE.md) - See what others are building with Fastro.
- [**Middleware**](MIDDLEWARES.md) - Explore the ecosystem and official plugins.
- [**Get Started**](DOCS.md) - Comprehensive documentation and API reference.
- [**Benchmarks**](BENCHMARK.md) - See how Fastro crushes performance tests.
- [**Contribute**](CONTRIBUTING.md) - Help us build the future of Deno web development.
- [**Sponsor**](https://github.com/sponsors/fastrodev) - Support the creator and get priority technical support.