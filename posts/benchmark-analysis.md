---
title: "Benchmark Analysis: Fastro vs Native Deno"
description: "A detailed analysis of the v1.0.0 performance benchmarks, exploring how Fastro achieves 94.8% efficiency compared to native Deno.serve."
date: 2026-02-02
author: "Fastro Team"
---

# Benchmark Analysis: Fastro vs Native Deno

We recently conducted a series of rigorous benchmarks to evaluate the performance overhead of Fastro v1.0.0 compared to the bare-metal `Deno.serve`. The results confirm our design philosophy: **High performance doesn't have to sacrifice developer experience.**

## The Results

The benchmark was executed using `k6` on a standardized environment. Here is the summary of the findings:

| Framework | Requests/sec | Avg Latency | p(95) Latency | % of Native |
| :--- | :--- | :--- | :--- | :--- |
| **Native Deno** | 81,906.97 | 1.14ms | 2.13ms | 100% |
| **Fastro** | 77,654.56 | 1.21ms | 2.20ms | 94.81% |

## Key Takeaways

### 1. Minimal Overhead (5.19%)
The most striking result is that Fastro delivers **94.81%** of Deno's native throughput. In the world of web frameworks, this is an exceptional "efficiency ratio." Most feature-rich frameworks incur a significant "tax," often dropping throughput by 30-50%. Fastro's overhead is a mere ~5%, which is practically negligible for the vast majority of production applications.

### 2. Consistent Latency
Latency is just as important as throughput. At over 77k requests per second, Fastro maintains an average latency of **1.21ms**, only **0.07ms** higher than native Deno. More importantly, the **p(95) latency** (the latency experienced by the 95th percentile of users) stays incredibly tight at **2.20ms**. This indicates that Fastro's routing logic and middleware execution are highly predictable and don't suffer from significant "jitter" or garbage collection spikes.

## How We Did It

This level of performance isn't accidental. It is the result of several targeted optimizations within the Fastro core:

*   **Optimized Router**: Our router avoids complex regex evaluation during request handling. Once a route is matched, the mapping is stored in an internal LRU cache, making subsequent matches for the same path near-instant.
*   **Lazy Getter Pattern**: Objects like query parameters and body parsing are only executed if they are accessed by the handler. This "pay-only-for-what-you-use" approach saves thousands of CPU cycles per second.
*   **Reduced Allocations**: We've carefully audited the request lifecycle to minimize the creation of temporary objects, reducing the pressure on Deno's memory manager.

## Conclusion

The v1.0.0 benchmark proves that Fastro succeeds in its mission to be a "wrapper" that feels like a full framework while performing like a low-level library. For developers building high-traffic services, Fastro provides the perfect balance of speed and productivity.

*Benchmarks were performed on Sun Feb 1 2026. For more details on running your own benchmarks, check out our [GitHub repository](https://github.com/fastrodev/fastro).*
