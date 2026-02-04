---
title: "Benchmark Analysis: Fastro vs Native Deno"
description: "A detailed analysis of the v1.0.0 performance benchmarks across multiple scenarios, from simple routing to JSON POST and middleware overhead."
date: 2026-02-03
author: "Fastro Team"
tags: ["benchmark", "performance", "deno"]
---

# Benchmark Analysis: Fastro vs Native Deno

We recently conducted a series of rigorous benchmarks to evaluate the performance overhead of Fastro v1.0.0 compared to the bare-metal `Deno.serve`. Unlike previous tests, we've expanded our analysis to cover five real-world scenarios: Root routing, URL parameters, Query parameters, Middleware execution, and JSON POST handling.

## The Results

The benchmark was executed using `k6` in a controlled environment. We compared Fastro against a native Deno implementation of the same logic.

> **Note:** Benchmark results may fluctuate depending on CPU resources, memory, and system load during the test execution.

| Scenario | Framework | Requests/sec | Avg Latency | % of Native |
| :--- | :--- | :--- | :--- | :--- |
| **Root (/)** | Native Deno | 63,085 | 1.49ms | 100% |
| | Fastro | 68,583 | 1.36ms | 108.71% |
| **URL Params** | Native Deno | 65,712 | 1.42ms | 100% |
| | Fastro | 61,498 | 1.53ms | 93.59% |
| **Query Params**| Native Deno | 53,761 | 1.75ms | 100% |
| | Fastro | 63,829 | 1.47ms | 118.73% |
| **Middleware** | Native Deno | 60,022 | 1.56ms | 100% |
| | Fastro | 63,411 | 1.48ms | 105.65% |
| **JSON POST** | Native Deno | 40,227 | 2.35ms | 100% |
| | Fastro | 39,072 | 2.43ms | 97.13% |

## Key Takeaways

### 1. Near-Native Routing
Fastro maintains **over 93%** of native Deno performance for common routing tasks, and in some cases, even matches or exceeds it. This is thanks to our **Zero-Allocation Routing** and aggressive **LRU caching**. Once a route is matched, Fastro avoids repeated regex execution, delivering performance that stays neck-and-neck with bare-metal speeds.

### 2. High Middleware Efficiency
Adding middleware usually incurs a heavy penalty in many frameworks. Fastro's middleware stack is designed to be ultra-lean, maintaining nearly **100% efficiency** compared to a manual native wrapper in our latest tests. This ensures you can add logging, auth, and security headers with minimal performance impact.

### 3. Predictable JSON Handling
Even with the added overhead of request body parsing and automatic JSON serialization, Fastro maintains over **97%** throughput of native code. The "Lazy Getter" pattern ensures that body parsing only happens when you actually access `req.json()`, saving cycles on requests that don't need it.

## How We Did It

This level of performance is consistent across all scenarios due to several architectural choices:

*   **Internal LRU Cache**: Our router doesn't just match strings; it caches the entire route context, including parameter positions, for near-instant lookup on subsequent requests.
*   **Minimalist Core**: We avoid heavy abstractions. When you use Fastro, you're essentially using a thin, intelligent layer over `Deno.serve`.
*   **Lazy Getter Pattern**: Objects like query parameters and body parsing are only executed if they are accessed by the handler.

## Conclusion

The v1.0.0 multi-scenario benchmark proves that Fastro is not just fast on paper, but robust in practice. Whether you're serving static content, building complex REST APIs with nested params, or processing heavy JSON payloads, Fastro provides a high-level API with a nearly invisible performance tax.

*Benchmarks were performed on Tue Feb 3 2026. For more details on running your own benchmarks, check out our [GitHub repository](https://github.com/fastrodev/fastro).*
