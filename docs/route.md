---
title: "Routing"
description: "Learn how to handle HTTP routes in Fastro applications"
image: https://fastro.deno.dev/fastro.png
previous: json
next: url-params
---

Fastro provides simple and intuitive routing methods for handling different HTTP
verbs. Each route method accepts a path and a handler function that returns a
response.

## Table of contents

## Basic Routes

```ts
import fastro from "https://fastro.deno.dev/mod.ts";

const f = new fastro();

f.get("/", () => ({ text: "Hello GET" }));
f.post("/", () => ({ text: "Hello POST" }));
f.put("/", () => ({ text: "Hello PUT" }));
f.delete("/", () => ({ text: "Hello DELETE" }));

await f.serve();
```

## HTTP Methods

- **GET**: Retrieve data from the server
- **POST**: Send data to create new resources
- **PUT**: Update existing resources
- **DELETE**: Remove resources

## Response Types

Route handlers can return various response types:

```ts
// Text response
f.get("/text", () => ({ text: "Plain text" }));

// JSON response
f.get("/json", () => ({ json: { message: "Hello JSON" } }));

// HTML response
f.get("/html", () => ({ html: "<h1>Hello HTML</h1>" }));
```

## Next Steps

- Learn about [URL Parameters](url-params) to capture dynamic route segments
- Explore [middleware](middleware) for request/response processing
