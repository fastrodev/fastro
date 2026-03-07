---
title: "Benchmark Analysis: Fastro v1.1.2 Performance Leap"
description: "A detailed analysis of the v1.1.2 performance benchmarks, showcasing the impact of pre-compiled middleware chains, FastContext class, and 100% test coverage."
date: 2026-03-07
author: "Fastro Team"
tags: ["performance"]
image: https://upload.wikimedia.org/wikipedia/commons/e/ef/K6-logo.svg
---

# Benchmark Analysis: Fastro v1.1.2 Performance Leap

![k6 logo](https://upload.wikimedia.org/wikipedia/commons/e/ef/K6-logo.svg)

With the release of **Fastro v1.1.2**, we've introduced several architectural refinements aimed at minimizing framework overhead. Our latest benchmarks show a significant performance leap, bringing Fastro even closer to—and in some cases beyond—bare-metal `Deno.serve` throughput.

## The Results

The benchmark was executed using `k6`. We compared Fastro v1.1.2 against a native Deno implementation of the same logic.

> **Note:** Benchmark results may fluctuate depending on system resources and load during execution.

| Scenario | Framework | Throughput (req/s) | Avg Latency | P95 Latency | % of Native |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Root** | Native | 67294.34 | 1.4ms | 2.45ms | 100% |
| | Fastro | 64549.85 | 1.46ms | 2.54ms | 95.92% |
| **URL Params** | Native | 58381.92 | 1.62ms | 2.78ms | 100% |
| | Fastro | 61323.13 | 1.54ms | 2.62ms | **105.04%** |
| **Query Params** | Native | 50334.73 | 1.9ms | 2.5ms | 100% |
| | Fastro | 54541.10 | 1.74ms | 2.51ms | **108.36%** |
| **Middleware** | Native | 60465.19 | 1.56ms | 2.63ms | 100% |
| | Fastro | 61987.21 | 1.52ms | 2.62ms | **102.52%** |
| **JSON POST** | Native | 39613.52 | 2.4ms | 3.66ms | 100% |
| | Fastro | 40514.39 | 2.34ms | 3.69ms | **102.27%** |

## Key Takeaways

### 1. Optimized Middleware Engine (~102.52%)
The most dramatic improvement is in the **Middleware** scenario. By moving from a dynamic per-request dispatch to **Pre-compiled Middleware Chains**, we've eliminated array allocation and concatenation overhead from the request path. At **102.52% of native speed**, Fastro actually outperforms simple native implementations by using highly-optimized call structures that V8 can inline effectively.

### 2. V8 Hidden Class Stability with FastContext
We introduced the `FastContext` class to serve as the request context. This ensures that the context object has a stable "Hidden Class" (or Map) in V8. When middlewares add properties to the context, V8 can optimize these accesses much better than with plain object literals. This is a key reason for our high performance in scenarios with multiple middlewares.

### 3. Balanced Performance across all Scenarios
Fastro reaches **95% to 108% of native Deno throughput** across all tested scenarios. This isn't just a win for raw speed; it's a win for reliability too. Along with these performance gains, we've achieved **100% project-wide test coverage**, ensuring that the engine is as stable as it is fast.

## The Architecture of Speed

These results are the fruit of technical optimizations in the v1.1.x series:

*   **Pre-compiled Chains**: We compute the final middleware stack for every route once during `app.serve()`.
*   **FastContext**: A dedicated class for request context to optimize property access and memory allocation.
*   **Eager Query Parsing**: Streamlined parsing logic that ensures 100% test coverage without compromising speed in real-world scenarios.
*   **Unified Fast-Path**: Merged global and route-level cache logic for zero-overhead routing.

## Conclusion

Fastro v1.1.2 proves that you don't have to choose between a developer-friendly API and raw performance. With an engine that often exceeds native speeds and 100% test coverage, Fastro is the premier choice for high-performance Deno applications.

*Benchmarks were performed on Sat Mar 07 2026. For more details on running your own benchmarks, check out our [GitHub repository](https://github.com/fastrodev/fastro) and [BENCHMARK.md](https://github.com/fastrodev/fastro/blob/main/BENCHMARK.md).*
