---
title: "Securing Your API with CORS Middleware"
description: "A comprehensive guide on how to configure Cross-Origin Resource Sharing (CORS) in Fastro to safely allow cross-domain requests."
date: 2026-02-04
author: "Fastro Team"
tags: ["middleware", "security", "cors"]
---

CORS (Cross-Origin Resource Sharing) is a crucial security mechanism for modern web applications. By default, browsers block scripts from making requests to a different domain than the one that served the page. Fastro provides a flexible and high-performance CORS middleware to manage these permissions easily.

## Why Use CORS?

If you are building an API that needs to be accessed by a frontend running on a different domain (e.g., your API is at `api.example.com` and your frontend is at `example.com`), you must configure CORS headers. Without it, your frontend's `fetch()` calls will fail.

## Quick Start

The simplest way to enable CORS for all domains is to use the default permissive middleware:

```ts
import Fastro from "https://deno.land/x/fastro/mod.ts";
import { corsMiddleware } from "https://deno.land/x/fastro/middlewares/cors/mod.ts";

const app = new Fastro();

// Enable CORS for all routes
app.use(corsMiddleware);

app.get("/", () => "CORS is enabled!");

await app.serve();
```

## Advanced Configuration

For production applications, you should restrict access to specific origins.

### Restricting Origins

You can pass an options object to the `cors` function to define exactly who can access your API:

```ts
import { cors } from "https://deno.land/x/fastro/middlewares/cors/mod.ts";

// Allow a single domain
app.use(cors({ origin: "https://myfrontend.com" }));

// Allow multiple domains
app.use(cors({ origin: ["https://a.com", "https://b.com"] }));

// Use a Regular Expression
app.use(cors({ origin: /\.trusted-domain\.com$/ }));

// Dynamic origin check with a function
app.use(cors({ 
  origin: (origin) => {
    return origin?.endsWith(".example.com");
  } 
}));
```

### Handling Credentials

If your frontend needs to send cookies or authorization headers, you must enable `credentials: true`. Note that when credentials are enabled, most browsers forbid using `origin: "*"`, so the middleware will automatically reflect the specific request origin.

```ts
app.use(cors({
  origin: "https://app.example.com",
  credentials: true
}));
```

### Methods and Headers

You can also control which HTTP methods and headers are allowed:

```ts
app.use(cors({
  allowMethods: ["GET", "POST"],
  allowHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400 // Cache preflight results for 24 hours
}));
```

## Performance Impact

Fastro's CORS middleware is designed with performance in mind. It performs minimal allocations and uses standard Deno `Headers` objects, ensuring that your API remains blazing fast even with complex CORS configurations.

---

Ready to build? check out our [Middlewares](/MIDDLEWARES.md) for more tools to power up your Fastro application.
