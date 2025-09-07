---
title: "URL Parameters"
description: "Learn how to capture and use dynamic URL parameters in Fastro applications"
image: https://fastro.deno.dev/fastro.png
previous: json
next: url-query
---

URL parameters allow you to capture dynamic segments from the request URL.
Fastro automatically parses these parameters and makes them available through
the `req.params` object.

## Table of contents

## Basic Usage

```ts
import fastro, { HttpRequest } from "https://fastro.deno.dev/mod.ts";

const f = new fastro();

// Single parameter
f.get("/:user", (req: HttpRequest) => {
  const { user } = req.params || {};
  return Response.json({ user });
});

await f.serve();
```

You can access with: `http://localhost:8000/agus`

This will return: `{"user": "agus"}`

## Multiple Parameters

Capture multiple dynamic segments in a single route:

```ts
f.get("/users/:id/posts/:postId", (req: HttpRequest) => {
  const { id, postId } = req.params || {};
  return Response.json({
    userId: id,
    postId: postId,
  });
});
```

Access with: `http://localhost:8000/users/123/posts/456`

Returns: `{"userId": "123", "postId": "456"}`

## Optional Parameters

Use the `?` modifier to make parameters optional:

```ts
f.get("/profile/:username/:tab?", (req: HttpRequest) => {
  const { username, tab } = req.params || {};
  return Response.json({
    username,
    tab: tab || "overview",
  });
});
```

Both URLs work:

- `http://localhost:8000/profile/john` →
  `{"username": "john", "tab": "overview"}`
- `http://localhost:8000/profile/john/settings` →
  `{"username": "john", "tab": "settings"}`

## Wildcard Parameters

Capture remaining path segments with `*`:

```ts
f.get("/files/*", (req: HttpRequest) => {
  const wildcard = req.params?.["*"];
  return Response.json({
    path: wildcard,
    segments: wildcard?.split("/") || [],
  });
});
```

Access with: `http://localhost:8000/files/documents/reports/2024/summary.pdf`

Returns:

```json
{
  "path": "documents/reports/2024/summary.pdf",
  "segments": ["documents", "reports", "2024", "summary.pdf"]
}
```

## Parameter Validation

Always validate parameters for production applications:

```ts
f.get("/api/users/:id", (req: HttpRequest) => {
  const id = req.params?.id;

  // Validate required parameter
  if (!id) {
    return new Response("User ID is required", { status: 400 });
  }

  // Validate numeric ID
  if (isNaN(Number(id))) {
    return new Response("Invalid user ID format", { status: 400 });
  }

  const userId = Number(id);

  // Business logic validation
  if (userId < 1) {
    return new Response("User ID must be positive", { status: 400 });
  }

  return Response.json({
    userId,
    message: `Fetching user ${userId}`,
  });
});
```

## Real-world Examples

### Blog Application

```ts
// Blog post by slug
f.get("/blog/:slug", (req: HttpRequest) => {
  const { slug } = req.params || {};
  // Fetch post from database using slug
  return Response.json({ post: `Content for ${slug}` });
});

// Blog post with category
f.get("/blog/:category/:slug", (req: HttpRequest) => {
  const { category, slug } = req.params || {};
  return Response.json({ category, slug });
});
```

### API Endpoints

```ts
// RESTful API patterns
f.get("/api/v1/users/:id", (req: HttpRequest) => {
  const { id } = req.params || {};
  return Response.json({ action: "get", userId: id });
});

f.put("/api/v1/users/:id", (req: HttpRequest) => {
  const { id } = req.params || {};
  return Response.json({ action: "update", userId: id });
});

f.delete("/api/v1/users/:id", (req: HttpRequest) => {
  const { id } = req.params || {};
  return Response.json({ action: "delete", userId: id });
});
```

### File Serving

```ts
// Serve files with nested paths
f.get("/static/*", (req: HttpRequest) => {
  const filePath = req.params?.["*"];

  if (!filePath) {
    return new Response("File path required", { status: 400 });
  }

  // Security: prevent directory traversal
  if (filePath.includes("..")) {
    return new Response("Invalid path", { status: 403 });
  }

  return Response.json({
    message: `Serving file: ${filePath}`,
  });
});
```

## Best Practices

### 1. Always Check for Parameter Existence

```ts
// Good
const { id } = req.params || {};
if (!id) {
  return new Response("ID required", { status: 400 });
}

// Avoid
const id = req.params.id; // Can throw if params is undefined
```

### 2. Use Descriptive Parameter Names

```ts
// Good
f.get("/users/:userId/orders/:orderId", handler);

// Avoid
f.get("/users/:id1/orders/:id2", handler);
```

### 3. Validate Parameter Types

```ts
// For numeric IDs
const id = Number(req.params?.id);
if (isNaN(id)) {
  return new Response("Invalid ID", { status: 400 });
}

// For UUIDs
const uuid = req.params?.uuid;
const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
if (!uuid || !uuidRegex.test(uuid)) {
  return new Response("Invalid UUID", { status: 400 });
}
```

### 4. Handle Missing Parameters Gracefully

```ts
f.get("/search/:query?", (req: HttpRequest) => {
  const { query } = req.params || {};

  if (!query) {
    return Response.json({
      results: [],
      message: "No search query provided",
    });
  }

  // Perform search with query
  return Response.json({
    results: [`Results for: ${query}`],
  });
});
```

### 5. Consider URL Encoding

```ts
f.get("/search/:query", (req: HttpRequest) => {
  const { query } = req.params || {};

  if (query) {
    const decodedQuery = decodeURIComponent(query);
    return Response.json({
      original: query,
      decoded: decodedQuery,
    });
  }

  return new Response("Query required", { status: 400 });
});
```

URL parameters are a powerful feature for creating dynamic, RESTful APIs.
Remember to always validate and sanitize parameter values before using them in
your application logic.
