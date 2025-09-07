---
title: "Application Middleware"
description: "Learn how to use application-level middleware in Fastro to modify requests and responses globally"
image: https://fastro.deno.dev/fastro.png
previous: url-query
next: route-middleware
---

Application middleware in Fastro runs for every request before reaching your
route handlers. It's perfect for adding common functionality like
authentication, logging, or request modification across your entire application.

## Table of contents

## Basic Usage

```ts
import fastro, { Context, HttpRequest } from "https://fastro.deno.dev/mod.ts";

const f = new fastro();

// Define middleware function
const middleware = (req: HttpRequest, ctx: Context) => {
  // Modify request object
  req.ok = true;

  // Add properties to context
  ctx.msg = "hello";
  ctx.getTitle = () => "Application Title";

  // Always call ctx.next() to continue to the next middleware or route
  return ctx.next();
};

// Register middleware globally
f.use(middleware);

// Route handler can access modified request and context
f.get("/", (req: HttpRequest, ctx: Context) => {
  return {
    ok: req.ok,
    msg: ctx.msg,
    title: ctx.getTitle(),
  };
});

await f.serve();
```

## Multiple Middleware

You can register multiple middleware functions that will execute in the order
they were added:

```ts
const logger = (req: HttpRequest, ctx: Context) => {
  console.log(`${req.method} ${req.url}`);
  return ctx.next();
};

const auth = (req: HttpRequest, ctx: Context) => {
  req.user = { id: 1, name: "John" };
  return ctx.next();
};

f.use(logger);
f.use(auth);
```

## Error Handling in Middleware

Middleware can also handle errors and prevent further execution:

```ts
const errorHandler = (req: HttpRequest, ctx: Context) => {
  try {
    // Some validation logic
    if (!req.headers.get("authorization")) {
      return ctx.json({ error: "Unauthorized" }, 401);
    }
    return ctx.next();
  } catch (error) {
    return ctx.json({ error: "Internal Server Error" }, 500);
  }
};

f.use(errorHandler);
```

## Key Points

- Middleware functions receive `HttpRequest` and `Context` objects
- Always call `ctx.next()` to continue to the next middleware or route handler
- Middleware executes in the order it was registered with `f.use()`
- You can modify both request and context objects that will be available in
  subsequent middleware and route handlers
- Middleware can return early to prevent further execution (useful for
  authentication, validation, etc.)
