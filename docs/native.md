---
title: "Working with Native Responses"
description: Learn how to return native response from your Fastro application endpoints
image: https://fastro.deno.dev/fastro.png
previous: hello-context
next: route
---

Fastro supports returning native Web API `Response` objects directly from your
route handlers, giving you full control over HTTP responses with standard web
APIs.

## Table of contents

## Basic String Response

The simplest way to return a response is using the `Response` constructor:

```ts
import fastro from "@app/mod.ts";

const f = new fastro();

f.get("/", () => new Response("Hello world"));

await f.serve();
```

## JSON Response

Return JSON data with proper content type headers:

```ts
f.get("/api/users", () => {
  const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ];

  return new Response(JSON.stringify(users), {
    headers: { "Content-Type": "application/json" },
  });
});
```

## Custom Headers and Status

Set custom status codes and headers:

```ts
f.get("/api/not-found", () => {
  return new Response("Resource not found", {
    status: 404,
    headers: {
      "Content-Type": "text/plain",
      "X-Custom-Header": "Custom Value",
    },
  });
});
```

## HTML Response

Return HTML content with proper content type:

```ts
f.get("/page", () => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head><title>My Page</title></head>
      <body><h1>Welcome</h1></body>
    </html>
  `;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
});
```

## Streaming Response

Stream large responses or real-time data:

```ts
f.get("/api/stream", () => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue("chunk 1\n");
      controller.enqueue("chunk 2\n");
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain" },
  });
});
```

## Response Utilities

Use `Response.json()` for convenient JSON responses:

```ts
f.get("/api/data", () => {
  return Response.json({ message: "Success", data: [] });
});
```

## Error Responses

Handle errors with appropriate status codes:

```ts
f.get("/api/error", () => {
  return new Response("Internal Server Error", {
    status: 500,
    statusText: "Internal Server Error",
  });
});
```

Native responses give you complete control over the HTTP response while
maintaining compatibility with web standards.
