---
title: "Route Middleware"
description: "Learn how to use route-specific middleware in Fastro to add functionality to individual routes or groups of routes"
image: https://fastro.deno.dev/fastro.png
previous: app-middleware
next: markdown
---

Route middleware in Fastro allows you to apply middleware functions to specific
routes rather than globally. This gives you fine-grained control over which
middleware runs for which endpoints.

## Table of contents

## Basic Usage

You can add middleware functions as additional parameters before your route
handler:

```ts
import fastro, { Context, HttpRequest } from "https://fastro.deno.dev/mod.ts";

const f = new fastro();

// Define middleware functions
const logger = (req: HttpRequest, ctx: Context) => {
  console.log(`${req.method} ${req.url}`);
  return ctx.next();
};

const auth = (req: HttpRequest, ctx: Context) => {
  req.user = { id: 1, name: "John" };
  return ctx.next();
};

// Apply middleware to specific route
f.get("/protected", logger, auth, (req: HttpRequest) => {
  return { message: `Hello ${req.user.name}` };
});

await f.serve();
```

## Multiple Route Middleware

You can chain multiple middleware functions for a single route. They execute in
the order they are defined:

```ts
const validateRequest = (req: HttpRequest, ctx: Context) => {
  console.log("Validating request");
  req.validated = true;
  return ctx.next();
};

const addTimestamp = (req: HttpRequest, ctx: Context) => {
  console.log("Adding timestamp");
  req.timestamp = Date.now();
  return ctx.next();
};

const enrichData = (req: HttpRequest, ctx: Context) => {
  console.log("Enriching data");
  req.enriched = true;
  return ctx.next();
};

const handler = (req: HttpRequest) => {
  return {
    validated: req.validated,
    timestamp: req.timestamp,
    enriched: req.enriched,
  };
};

// All middleware will run in order: validateRequest → addTimestamp → enrichData → handler
f.get("/", validateRequest, addTimestamp, enrichData, handler);
```

## Different Middleware for Different Routes

You can apply different middleware combinations to different routes:

```ts
const authMiddleware = (req: HttpRequest, ctx: Context) => {
  req.authenticated = true;
  return ctx.next();
};

const adminMiddleware = (req: HttpRequest, ctx: Context) => {
  req.isAdmin = true;
  return ctx.next();
};

const loggerMiddleware = (req: HttpRequest, ctx: Context) => {
  console.log(`Request to ${req.url}`);
  return ctx.next();
};

// Public route - no middleware
f.get("/public", (req: HttpRequest) => {
  return { message: "Public access" };
});

// Protected route - auth middleware only
f.get("/user", authMiddleware, (req: HttpRequest) => {
  return { message: "User area", authenticated: req.authenticated };
});

// Admin route - both auth and admin middleware
f.get("/admin", authMiddleware, adminMiddleware, (req: HttpRequest) => {
  return {
    message: "Admin area",
    authenticated: req.authenticated,
    isAdmin: req.isAdmin,
  };
});

// Logged route - logger middleware only
f.post("/data", loggerMiddleware, (req: HttpRequest) => {
  return { message: "Data received" };
});
```

## Route Middleware vs Application Middleware

```ts
// Application middleware - runs for ALL routes
f.use((req: HttpRequest, ctx: Context) => {
  req.globalProperty = "Available everywhere";
  return ctx.next();
});

// Route middleware - runs only for specific routes
const routeSpecific = (req: HttpRequest, ctx: Context) => {
  req.routeProperty = "Only for this route";
  return ctx.next();
};

f.get("/global", (req: HttpRequest) => {
  return {
    global: req.globalProperty, // ✅ Available (from app middleware)
    route: req.routeProperty || null, // ❌ null (no route middleware)
  };
});

f.get("/specific", routeSpecific, (req: HttpRequest) => {
  return {
    global: req.globalProperty, // ✅ Available (from app middleware)
    route: req.routeProperty, // ✅ Available (from route middleware)
  };
});
```

## Error Handling in Route Middleware

Route middleware can handle errors and prevent the route handler from executing:

```ts
const validateApiKey = (req: HttpRequest, ctx: Context) => {
  const apiKey = req.headers.get("x-api-key");

  if (!apiKey) {
    return ctx.json({ error: "API key required" }, 401);
  }

  if (apiKey !== "valid-key") {
    return ctx.json({ error: "Invalid API key" }, 403);
  }

  req.validApiKey = true;
  return ctx.next();
};

// This handler will only run if the API key is valid
f.get("/api/data", validateApiKey, (req: HttpRequest) => {
  return { data: "Secret information", validated: req.validApiKey };
});
```

## Key Points

- Route middleware only applies to the specific routes where it's defined
- Multiple middleware functions can be chained for a single route
- Middleware executes in the order it's defined (left to right)
- Route middleware runs after application middleware but before the route
  handler
- Each middleware must call `ctx.next()` to continue the chain
- Middleware can return early to prevent the route handler from executing
- Different routes can have completely different middleware combinations
