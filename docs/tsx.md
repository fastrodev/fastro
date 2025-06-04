---
title: "TSX Pages"
description: Learn how to create server-side rendered pages using TSX components in Fastro
image: https://fastro.deno.dev/fastro.png
previous: static
next: tsx-component
---

Fastro supports TSX (TypeScript JSX) for creating server-side rendered pages
with React-like syntax using Preact components.

## Table of contents

## Basic TSX Page

Create a `hello.tsx` file:

```ts
import fastro, { Context, HttpRequest } from "https://fastro.deno.dev/mod.ts";

const f = new fastro();

f.get("/", (_req: HttpRequest, ctx: Context) => {
  return ctx.render(<h1>Hello, TSX!</h1>);
});

await f.serve();
```

## How It Works

- **TSX Support**: Fastro automatically processes TSX syntax
- **Server-Side Rendering**: Components are rendered on the server
- **Context Rendering**: Use `ctx.render()` to render TSX elements
- **Type Safety**: Full TypeScript support with proper type checking

## Dynamic Content

You can pass dynamic data to your TSX components:

```ts
f.get("/user/:name", (req: HttpRequest, ctx: Context) => {
  const name = req.params?.name || "Guest";

  return ctx.render(
    <div>
      <h1>Welcome, {name}!</h1>
      <p>This page was rendered server-side.</p>
    </div>,
  );
});
```

## Next Steps

Learn how to create reusable
[TSX Components](tsx-component?section=handling-requests) for better code
organization.
