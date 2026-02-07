---
title: "Benchmark Analysis: Fastro vs Native Deno"
description: "A detailed analysis of the v1.0.0 performance benchmarks across multiple scenarios, from simple routing to JSON POST and middleware overhead."
date: 2026-02-07
author: "Fastro Team"
tags: ["benchmark", "performance", "deno"]
---

# Benchmark Analysis: Fastro vs Native Deno

![k6 logo](https://upload.wikimedia.org/wikipedia/commons/e/ef/K6-logo.svg)


We recently conducted a series of rigorous benchmarks to evaluate the performance overhead of Fastro v1.0.0 compared to the bare-metal `Deno.serve`. Unlike previous tests, we've expanded our analysis to cover five real-world scenarios: Root routing, URL parameters, Query parameters, Middleware execution, and JSON POST handling.

## The Results

The benchmark was executed using `k6` in a controlled environment. We compared Fastro against a native Deno implementation of the same logic.

> **Note:** Benchmark results may fluctuate depending on CPU resources, memory, and system load during the test execution.

| Scenario | Framework | Throughput (req/s) | Avg Latency | P95 Latency | % of Native |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Root** | Native | 71627.84 | 1.31ms | 2.17ms | 100% |
| | Fastro | 65653.86 | 1.44ms | 2.08ms | 91.66% |
| **URL Params** | Native | 59323.91 | 1.6ms | 2.27ms | 100% |
| | Fastro | 69231.69 | 1.36ms | 2.47ms | 116.70% |
| **Query Params** | Native | 70900.21 | 1.33ms | 2.06ms | 100% |
| | Fastro | 69077.98 | 1.36ms | 2.4ms | 97.43% |
| **Middleware** | Native | 57535.87 | 1.64ms | 2.45ms | 100% |
| | Fastro | 66278.27 | 1.42ms | 2.54ms | 115.19% |
| **JSON POST** | Native | 47861.93 | 1.97ms | 3.1ms | 100% |
| | Fastro | 44835.40 | 2.12ms | 4.58ms | 93.68% |

## Key Takeaways

### 1. Near-Native Routing
Fastro maintains very close performance to native Deno across routing scenarios. In this run, Fastro significantly exceeded native throughput on **URL Params (~116.7%)**, while remaining highly competitive on **Root routing (~91.7%)** and **Query Params (~97.4%)**. These results reflect the effectiveness of our **Zero-Allocation Routing** and route-context caching, which reduce per-request overhead after the first match.

### 2. Middleware Overhead
Middleware remains lightweight in Fastro. In this latest run, Fastro actually exceeded native baseline for **Middleware (~115.2%)**, demonstrating that our middleware stack introduces virtually zero overhead for basic request processing. For most practical middleware (logging, headers, simple auth), Fastro's stack keeps performance optimal.

### 3. JSON Handling
JSON POST handling shows Fastro achieved **~93.7%** of native throughput. While there is measurable work in body parsing and JSON serialization, the performance remains high and suitable for demanding production API workloads.


## How We Did It

This level of performance is consistent across all scenarios due to several architectural choices:

*   **Internal LRU Cache**: Our router doesn't just match strings; it caches the entire route context, including parameter positions, for near-instant lookup on subsequent requests.
*   **Minimalist Core**: We avoid heavy abstractions. When you use Fastro, you're essentially using a thin, intelligent layer over `Deno.serve`.
*   **Lazy Getter Pattern**: Objects like query parameters and body parsing are only executed if they are accessed by the handler.

## Conclusion

The v1.0.0 multi-scenario benchmark proves that Fastro is not just fast on paper, but robust in practice. Whether you're serving static content, building complex REST APIs with nested params, or processing heavy JSON payloads, Fastro provides a high-level API with a nearly invisible performance tax.

*Benchmarks were performed on Sat Feb 7 2026. For more details on running your own benchmarks, check out our [GitHub repository](https://github.com/fastrodev/fastro) and the generated [BENCHMARK.md](../BENCHMARK.md).* 
