---
title: "URL Query Parameters"
description: Learn how to handle URL query parameters in Fastro applications
image: https://fastro.deno.dev/fastro.png
previous: url-params
next: app-middleware
---

URL query parameters are key-value pairs that appear after the `?` symbol in a
URL. They provide a way to pass additional data to your application endpoints.

## Table of contents

## Basic Usage

Here's how to access query parameters in your Fastro application:

```ts
import fastro, { HttpRequest } from "https://fastro.deno.dev/mod.ts";

const f = new fastro();

f.get("/:user", (req: HttpRequest) => {
  const data = {
    user: req.params?.user,
    title: req.query?.title,
  };
  return Response.json(data);
});

await f.serve();
```

## How It Works

1. **Route Parameter**: The `:user` in the route captures the path segment
2. **Query Access**: Use `req.query` to access query parameters
3. **Safe Access**: The `?.` operator provides safe property access

## Example Request

Access your endpoint with query parameters:

```
http://localhost:8000/agus?title=head
```

This will return:

```json
{
  "user": "agus",
  "title": "head"
}
```

## Multiple Query Parameters

You can handle multiple query parameters:

```ts
f.get("/:user", (req: HttpRequest) => {
  const data = {
    user: req.params?.user,
    title: req.query?.title,
    category: req.query?.category,
    limit: req.query?.limit,
  };
  return Response.json(data);
});
```

Example request:

```
http://localhost:8000/john?title=article&category=tech&limit=10
```

## Query Parameter Validation

For production applications, consider validating query parameters:

```ts
f.get("/:user", (req: HttpRequest) => {
  const title = req.query?.title;
  const limit = parseInt(req.query?.limit || "10");

  if (!title) {
    return new Response("Title parameter is required", { status: 400 });
  }

  const data = {
    user: req.params?.user,
    title,
    limit: Math.min(limit, 100), // Cap at 100
  };

  return Response.json(data);
});
```

## Best Practices

- Always use optional chaining (`?.`) when accessing query parameters
- Validate and sanitize query parameter values
- Provide default values for optional parameters
- Consider the maximum URL length limitations
- Use meaningful parameter names

## Next Steps

Learn about [Application Middleware](./app-middleware.md) to add common
functionality across your routes.
