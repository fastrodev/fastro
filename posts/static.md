---
title: "Mastering Static Files: Middleware and 100% Test Coverage"
description: "Exploring the new Fastro static middleware: featuring production-grade LRU caching, SPA fallback, and how we achieved 100% unit test coverage."
date: 2026-02-02
author: "Fastro Team"
tags: ["middleware", "performance"]
---

# Mastering Static Files: Middleware and 100% Test Coverage

Serving static assets efficiently is a cornerstone of web development. Today, we're introducing the `staticFiles` middleware for Fastro—a robust solution designed for performance and reliability.

## Key Features

The new static middleware isn't just a simple file server. It's built with modern production requirements in mind:

- **Intelligent LRU Caching**: In production mode (`ENV=production`), Fastro caches files in memory using a Least Recently Used (LRU) eviction strategy. This drastically reduces disk I/O for frequently accessed assets.
- **SPA Fallback**: A critical feature for modern Single Page Applications (React, Vue, Svelte, etc.).
    - **The Problem**: In SPAs, routing is handled on the client side. If a user refreshes the page at `/dashboard`, the server looks for a physical file named `dashboard` which doesn't exist, resulting in a 404 error.
    - **The Solution**: With `spaFallback: true`, the server automatically serves `index.html` when a requested file is missing. This allows the client-side router (e.g., React Router) to take over and render the correct component based on the URL.
- **Auto MIME Mapping**: Support for a wide range of extensions out of the box, from standard `.html` and `.js` to modern web fonts (`.woff2`, `.ttf`).
- **Cache Control**: Intelligent headers based on the environment, ensuring browsers cache assets effectively in production while allowing developers to see changes instantly in development.

## Engineering Excellence: 100% Coverage

Software reliability is non-negotiable at Fastro. To ensure the `staticFiles` middleware works flawlessly under all conditions, we've implemented a comprehensive test suite.

Using the `Deno.test` runner and `@std/testing/time`'s `FakeTime`, we've achieved **100% test coverage** for both lines and branches. 

### What we tested:
- **Root & Subdirectory Serving**: Ensuring files are found regardless of path depth.
- **Cache Expiry Logic**: Using virtual time to verify that cached items are correctly invalidated after 1 hour.
- **LRU Eviction**: Simulating heavy load to confirm that the cache respects its 100-file limit.
- **Security & Method Handling**: Verifying that only `GET` requests are served and prefixes are strictly enforced.

## How to Use

Adding static file support to your Fastro app is now easier than ever:

```typescript
import { Fastro } from "https://deno.land/x/fastro/mod.ts";
import { staticFiles } from "https://deno.land/x/fastro/middlewares/static/static.ts";

const app = new Fastro();

// Serve files from the 'public' folder at the '/static' URL prefix
app.use(staticFiles("/static", "./public", { spaFallback: true }));

await app.serve();
```

## Conclusion

With the addition of the static middleware and our commitment to 100% test coverage, Fastro continues to provide a solid foundation for building high-performance web applications.

Stay tuned for more updates as we continue to refine the framework!
