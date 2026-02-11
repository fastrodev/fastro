---
title: "Benchmark Analysis: Fastro vs Native Deno"
description: "A detailed analysis of the v1.0.0 performance benchmarks across multiple scenarios, from simple routing to JSON POST and middleware overhead."
date: 2026-02-11
author: "Fastro Team"
tags: ["performance"]
image: https://upload.wikimedia.org/wikipedia/commons/e/ef/K6-logo.svg
---

# Benchmark Analysis: Fastro vs Native Deno

![k6 logo](https://upload.wikimedia.org/wikipedia/commons/e/ef/K6-logo.svg)


We recently conducted a series of rigorous benchmarks to evaluate the performance overhead of Fastro v1.0.0 compared to the bare-metal `Deno.serve`. Unlike previous tests, we've expanded our analysis to cover five real-world scenarios: Root routing, URL parameters, Query parameters, Middleware execution, and JSON POST handling.

## The Results

The benchmark was executed using `k6` in a controlled environment. We compared Fastro against a native Deno implementation of the same logic.

> **Note:** Benchmark results may fluctuate depending on CPU resources, memory, and system load during the test execution.

| Scenario | Framework | Throughput (req/s) | Avg Latency | P95 Latency | % of Native |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Root** | Native | 56487.59 | 1.62ms | 2.25ms | 100% |
| | Fastro | 58415.48 | 1.61ms | 2.18ms | 103.41% |
| **URL Params** | Native | 70051.01 | 1.34ms | 2.39ms | 100% |
| | Fastro | 67187.56 | 1.4ms | 2.59ms | 95.91% |
| **Query Params** | Native | 71441.01 | 1.32ms | 2.14ms | 100% |
| | Fastro | 68697.09 | 1.37ms | 2.45ms | 96.16% |
| **Middleware** | Native | 55377.44 | 1.72ms | 2.13ms | 100% |
| | Fastro | 49484.92 | 1.81ms | 2.53ms | 89.36% |
| **JSON POST** | Native | 47975.98 | 1.97ms | 3.12ms | 100% |
| | Fastro | 41570.44 | 2.29ms | 4.84ms | 86.65% |

## Key Takeaways

### 1. Near-Native Routing
Fastro maintains very close performance to native Deno across routing scenarios. In this run, Fastro exceeded native throughput on **Root routing (~103.41%)**, while remaining highly competitive on **URL Params (~95.91%)** and **Query Params (~96.16%)**. These results reflect the effectiveness of our **Zero-Allocation Routing** and route-context caching, which reduce per-request overhead after the first match.

### 2. Middleware Overhead
Middleware remains lightweight in Fastro. In this latest run, Fastro achieved **~89.36%** of the native baseline for **Middleware**, demonstrating that our middleware stack introduces very low overhead for standard request processing.

### 3. JSON Handling
JSON POST handling shows Fastro achieved **~86.65%** of native throughput. While there is measurable work in body parsing and JSON serialization, the performance remains high and suitable for demanding production API workloads.


## How We Did It

This level of performance is consistent across all scenarios due to several architectural choices:

*   **Internal LRU Cache**: Our router doesn't just match strings; it caches the entire route context, including parameter positions, for near-instant lookup on subsequent requests.
*   **Minimalist Core**: We avoid heavy abstractions. When you use Fastro, you're essentially using a thin, intelligent layer over `Deno.serve`.
*   **Lazy Getter Pattern**: Objects like query parameters and body parsing are only executed if they are accessed by the handler.

## Conclusion

The v1.0.0 multi-scenario benchmark proves that Fastro is not just fast on paper, but robust in practice. Whether you're serving static content, building complex REST APIs with nested params, or processing heavy JSON payloads, Fastro provides a high-level API with a nearly invisible performance tax.

*Benchmarks were performed on Wed Feb 11 2026. For more details on running your own benchmarks, check out our [GitHub repository](https://github.com/fastrodev/fastro) and the generated [BENCHMARK.md](../BENCHMARK.md).* 
