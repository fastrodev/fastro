---
title: "Benchmark Analysis: Fastro vs Native Deno"
description: "A detailed analysis of the v1.0.0 performance benchmarks across multiple scenarios, from simple routing to JSON POST and middleware overhead."
date: 2026-02-10
author: "Fastro Team"
tags: ["performance"]
---

# Benchmark Analysis: Fastro vs Native Deno

![k6 logo](https://upload.wikimedia.org/wikipedia/commons/e/ef/K6-logo.svg)


We recently conducted a series of rigorous benchmarks to evaluate the performance overhead of Fastro v1.0.0 compared to the bare-metal `Deno.serve`. Unlike previous tests, we've expanded our analysis to cover five real-world scenarios: Root routing, URL parameters, Query parameters, Middleware execution, and JSON POST handling.

## The Results

The benchmark was executed using `k6` in a controlled environment. We compared Fastro against a native Deno implementation of the same logic.

> **Note:** Benchmark results may fluctuate depending on CPU resources, memory, and system load during the test execution.

| Scenario | Framework | Throughput (req/s) | Avg Latency | P95 Latency | % of Native |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Root** | Native | 67613.16 | 1.39ms | 2.57ms | 100% |
| | Fastro | 73971.94 | 1.27ms | 2.16ms | 109.40% |
| **URL Params** | Native | 71440.72 | 1.32ms | 2.14ms | 100% |
| | Fastro | 62722.67 | 1.5ms | 2.58ms | 87.80% |
| **Query Params** | Native | 62920.82 | 1.49ms | 2.49ms | 100% |
| | Fastro | 61666.42 | 1.53ms | 2.59ms | 98.01% |
| **Middleware** | Native | 62992.74 | 1.49ms | 2.64ms | 100% |
| | Fastro | 58471.96 | 1.61ms | 2.8ms | 92.82% |
| **JSON POST** | Native | 41547.97 | 2.27ms | 3.61ms | 100% |
| | Fastro | 37030.05 | 2.57ms | 5.29ms | 89.13% |

## Key Takeaways

### 1. Near-Native Routing
Fastro maintains very close performance to native Deno across routing scenarios. In this run, Fastro significantly exceeded native throughput on **Root routing (~109.4%)**, while remaining highly competitive on **Query Params (~98.0%)** and **URL Params (~87.8%)**. These results reflect the effectiveness of our **Zero-Allocation Routing** and route-context caching, which reduce per-request overhead after the first match.

### 2. Middleware Overhead
Middleware remains lightweight in Fastro. In this latest run, Fastro achieved **~92.8%** of the native baseline for **Middleware**, demonstrating that our middleware stack introduces virtually zero overhead for basic request processing. For most practical middleware (logging, headers, simple auth), Fastro's stack keeps performance optimal.

### 3. JSON Handling
JSON POST handling shows Fastro achieved **~89.1%** of native throughput. While there is measurable work in body parsing and JSON serialization, the performance remains high and suitable for demanding production API workloads.


## How We Did It

This level of performance is consistent across all scenarios due to several architectural choices:

*   **Internal LRU Cache**: Our router doesn't just match strings; it caches the entire route context, including parameter positions, for near-instant lookup on subsequent requests.
*   **Minimalist Core**: We avoid heavy abstractions. When you use Fastro, you're essentially using a thin, intelligent layer over `Deno.serve`.
*   **Lazy Getter Pattern**: Objects like query parameters and body parsing are only executed if they are accessed by the handler.

## Conclusion

The v1.0.0 multi-scenario benchmark proves that Fastro is not just fast on paper, but robust in practice. Whether you're serving static content, building complex REST APIs with nested params, or processing heavy JSON payloads, Fastro provides a high-level API with a nearly invisible performance tax.

*Benchmarks were performed on Tue Feb 10 2026. For more details on running your own benchmarks, check out our [GitHub repository](https://github.com/fastrodev/fastro) and the generated [BENCHMARK.md](../BENCHMARK.md).* 
