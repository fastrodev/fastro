---
title: "Benchmark Analysis: Fastro vs Native Deno"
description: "A detailed analysis of the v1.0.0 performance benchmarks across multiple scenarios, from simple routing to JSON POST and middleware overhead."
date: 2026-02-03
author: "Fastro Team"
---

# Benchmark Analysis: Fastro vs Native Deno

We recently conducted a series of rigorous benchmarks to evaluate the performance overhead of Fastro v1.0.0 compared to the bare-metal `Deno.serve`. Unlike previous tests, we've expanded our analysis to cover five real-world scenarios: Root routing, URL parameters, Query parameters, Middleware execution, and JSON POST handling.

## The Results

The benchmark was executed using `k6` in a controlled environment. We compared Fastro against a native Deno implementation of the same logic.

| Scenario | Framework | Requests/sec | Avg Latency | % of Native |
| :--- | :--- | :--- | :--- | :--- |
| **Root (/)** | Native Deno | 53,770 | 1.74ms | 100% |
| | Fastro | 55,326 | 1.69ms | 102.89% |
| **URL Params** | Native Deno | 50,236 | 1.87ms | 100% |
| | Fastro | 51,417 | 1.83ms | 102.35% |
| **Query Params**| Native Deno | 50,498 | 1.86ms | 100% |
| | Fastro | 51,302 | 1.83ms | 101.59% |
| **Middleware** | Native Deno | 53,567 | 1.75ms | 100% |
| | Fastro | 50,491 | 1.86ms | 94.26% |
| **JSON POST** | Native Deno | 34,245 | 2.76ms | 100% |
| | Fastro | 32,101 | 2.96ms | 93.74% |

## Key Takeaways

### 1. Zero-Cost Routing
In simple routing scenarios (Root and URL Params), Fastro actually performs slightly better or equal to manual native implementations. This is thanks to our **Zero-Allocation Routing** and aggressive **LRU caching**. Once a route is matched, Fastro avoids repeated regex execution, delivering performance that matches bare-metal speeds.

### 2. High Middleware Efficiency
Adding middleware usually incurs a heavy penalty in many frameworks. Fastro's middleware stack is designed to be ultra-lean, maintaining over **94% efficiency** compared to a manual native wrapper. This ensures you can add logging, auth, and security headers without worrying about a significant performance drop.

### 3. Predictable JSON Handling
Even with the added overhead of request body parsing and automatic JSON serialization, Fastro maintains **93.7%** throughput of native code. The "Lazy Getter" pattern ensures that body parsing only happens when you actually access `req.json()`, saving cycles on requests that don't need it.

## How We Did It

This level of performance is consistent across all scenarios due to several architectural choices:

*   **Internal LRU Cache**: Our router doesn't just match strings; it caches the entire route context, including parameter positions, for near-instant lookup on subsequent requests.
*   **Minimalist Core**: We avoid heavy abstractions. When you use Fastro, you're essentially using a thin, intelligent layer over `Deno.serve`.
*   **Lazy Getter Pattern**: Objects like query parameters and body parsing are only executed if they are accessed by the handler.

## Conclusion

The v1.0.0 multi-scenario benchmark proves that Fastro is not just fast on paper, but robust in practice. Whether you're serving static content, building complex REST APIs with nested params, or processing heavy JSON payloads, Fastro provides a high-level API with a nearly invisible performance tax.

*Benchmarks were performed on Tue Feb 3 2026. For more details on running your own benchmarks, check out our [GitHub repository](https://github.com/fastrodev/fastro).*
