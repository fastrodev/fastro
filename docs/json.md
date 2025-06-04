---
title: "Working with JSON Responses"
description: Learn how to return JSON data from your Fastro application endpoints
image: https://fastro.deno.dev/fastro.png
previous: hello-context
next: route
---

Fastro makes it easy to return JSON responses from your API endpoints. Simply
return a JavaScript object from your route handler, and Fastro will
automatically serialize it to JSON.

## Table of contents

## Basic JSON Response

```ts
import fastro from "https://fastro.deno.dev/mod.ts";

const f = new fastro();

// Return a simple JSON object
f.get("/", () => ({ message: "Hello JSON!" }));

await f.serve();
```

## Multiple JSON Endpoints

```ts
import fastro from "https://fastro.deno.dev/mod.ts";

const f = new fastro();

// Simple greeting
f.get("/", () => ({ message: "Welcome to Fastro API" }));

// User data
f.get("/user", () => ({
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  active: true,
}));

// Array of items
f.get("/items", () => ({
  items: [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
  ],
  total: 3,
}));

await f.serve();
```

## Key Features

- **Automatic Serialization**: Objects are automatically converted to JSON
- **Proper Headers**: Content-Type is set to `application/json`
- **Type Safety**: Works seamlessly with TypeScript types

## Response Format

When you return an object, Fastro automatically:

1. Sets the `Content-Type` header to `application/json`
2. Serializes the object using `JSON.stringify()`
3. Returns the JSON string as the response body

Try visiting `http://localhost:8000/` to see your JSON response in action!
