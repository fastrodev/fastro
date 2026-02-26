# Fastro — Minimal, fast web framework for Deno

![Fastro](https://repository-images.githubusercontent.com/264308713/1b83bd0f-b9d9-466d-9e63-f947c1a67281)

[![build](https://github.com/fastrodev/fastro/actions/workflows/ci.yml/badge.svg)](https://github.com/fastrodev/fastro/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/fastrodev/fastro/badge.svg?branch=main)](https://coveralls.io/github/fastrodev/fastro?branch=main)

Fastro is a tiny, high-performance web framework for Deno focused on clarity, type-safety, and raw speed.

- Blazing fast: near-native Deno performance (see Benchmarks).
- Minimal core: no runtime dependencies, small surface area.
- Ergonomic APIs: return JSON, strings, or Responses directly.
- Pluggable: opt-in middlewares and automatic module loading.

Get started in seconds:

```ts
import Fastro from "https://deno.land/x/fastro/mod.ts";

const app = new Fastro();

app.get("/user/:id", (req, ctx) => ({ id: ctx.params.id, status: "active" }));

await app.serve({ port: 8000 });
```

Convenience tasks (via `deno.json`):

- Start the app: `deno task start`
- Run the local benchmark script: `deno task bench` (requires `k6`)
- Run the test suite: `deno task test`
- Produce LCOV coverage: `deno task cov`

Links and docs

- Docs: https://fastro.deno.dev/DOCS.md
- Middlewares: https://fastro.deno.dev/MIDDLEWARES.md
- Benchmarks: https://fastro.deno.dev/BENCHMARK.md
- Contributing: https://fastro.deno.dev/CONTRIBUTING.md
