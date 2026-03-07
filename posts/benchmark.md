---
title: "Benchmark Analysis: Fastro v1.1.0 Performance Leap"
description: "A detailed analysis of the v1.1.0 performance benchmarks, showcasing the impact of pre-built middleware chains and unified cache fast-paths."
date: 2026-03-07
author: "Fastro Team"
tags: ["performance"]
image: https://upload.wikimedia.org/wikipedia/commons/e/ef/K6-logo.svg
---

# Benchmark Analysis: Fastro v1.1.0 Performance Leap

![k6 logo](https://upload.wikimedia.org/wikipedia/commons/e/ef/K6-logo.svg)

With the release of **Fastro v1.1.0**, we've introduced several architectural refinements aimed at minimizing framework overhead. Our latest benchmarks show a significant performance leap, particularly in middleware-heavy scenarios and JSON processing, bringing Fastro even closer to—and in some cases beyond—bare-metal `Deno.serve` throughput.

## The Results

The benchmark was executed using `k6`. We compared Fastro v1.1.0 against a native Deno implementation of the same logic.

> **Note:** Benchmark results may fluctuate depending on system resources and load during execution.

| Scenario | Framework | Throughput (req/s) | Avg Latency | P95 Latency | % of Native |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Root** | Native | 60501.14 | 1.57ms | 2.38ms | 100% |
| | Fastro | 59457.84 | 1.6ms | 2.51ms | 98.28% |
| **URL Params** | Native | 63534.90 | 1.49ms | 2.58ms | 100% |
| | Fastro | 59795.07 | 1.58ms | 2.96ms | 94.11% |
| **Query Params** | Native | 55149.20 | 1.72ms | 2.96ms | 100% |
| | Fastro | 58408.15 | 1.62ms | 3.1ms | **105.91%** |
| **Middleware** | Native | 50371.87 | 1.89ms | 2.88ms | 100% |
| | Fastro | 50267.10 | 1.9ms | 3.16ms | **99.79%** |
| **JSON POST** | Native | 41311.82 | 2.3ms | 3.84ms | 100% |
| | Fastro | 39271.19 | 2.43ms | 4.79ms | **95.06%** |

## Key Takeaways

### 1. Zero-Overhead Middleware (~99.79%)
The most dramatic improvement is in the **Middleware** scenario. By moving from a dynamic per-request dispatch to **Pre-built Middleware Chains**, we've eliminated array allocation and concatenation overhead from the request path. At **99.79% of native speed**, the framework tax for middleware in Fastro is now virtually zero.

### 2. Intelligent Cache Fast-Paths
Our new **Unified Cache Fast-path** allows Fastro to execute the entire middleware stack and route handler in a single optimized lifecycle. This is evident in the **Query Params** scenario, where Fastro actually outperformed native Deno (**105.91%**), likely due to our specialized lazy query parsing and internal caching mechanisms.

### 3. High-Efficiency JSON Processing (~95.06%)
JSON handling saw a significant jump from ~86% in previous versions to **95.06%**. This improvement stems from a more streamlined context flow and reduced closure allocations, ensuring that even data-heavy POST requests remain blazing fast.

## The Architecture of Speed

These results are the fruit of three specific technical optimizations in the v1.1.x series:

*   **Pre-built Chains**: We calculate the final middleware stack for every route once during `app.serve()`, not per request.
*   **V8-Friendly Dispatch**: Our internal execution loop is designed specifically to be JIT-optimized by the V8 engine, keeping hot paths extremely thin.
*   **Unified Fast-Path**: We merged the global and route-level cache logic, eliminating the "double-dispatch" bottleneck that existed in earlier versions.

## Conclusion

Fastro v1.1.0 proves that you don't have to choose between a developer-friendly API and raw performance. With a middleware stack that runs at near-native speeds and a core that reaches 100% test coverage, Fastro provides a rock-solid foundation for high-performance Deno applications.

*Benchmarks were performed on Sat Mar 07 2026. For more details on running your own benchmarks, check out our [GitHub repository](https://github.com/fastrodev/fastro) and [BENCHMARK.md](https://github.com/fastrodev/fastro/blob/main/BENCHMARK.md).*
 
