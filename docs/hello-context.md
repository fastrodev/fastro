---
title: "Working with Context"
description: Create a simple route using Fastro's application context for enhanced response handling
image: https://fastro.deno.dev/fastro.png
previous: hello
next: json
---

This example demonstrates how to use Fastro's `Context` object to handle HTTP
responses. The context provides convenient methods for sending responses with
proper status codes and headers.

## Table of contents

## Basic Usage

```ts
import fastro, { Context, HttpRequest } from "https://fastro.deno.dev/mod.ts";

const f = new fastro();

f.get(
  "/",
  (_req: HttpRequest, ctx: Context) => {
    return ctx.send("Hello world", 200);
  },
);

await f.serve();
```

## Key Features

- **Context Object**: The `ctx` parameter provides access to response methods
- **Status Codes**: Easily set HTTP status codes with the response
- **Type Safety**: Full TypeScript support for request and context parameters

## Context Methods

The `Context` object offers several useful methods:

- `ctx.send(data, status)` - Send response with data and status code
- `ctx.json(data, status)` - Send JSON response
- `ctx.redirect(url, status)` - Redirect to another URL

## Running the Example

Save the code to a file (e.g., `hello-context.ts`) and run:

```bash
deno run --allow-net hello-context.ts
```

Visit `http://localhost:8000` to see "Hello world" displayed in your browser.
