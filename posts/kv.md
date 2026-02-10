---
title: "Persistent Storage made Easy: Fastro + Deno KV"
description: "Learn how to use the official Deno KV middleware for Fastro to build persistent applications with zero configuration."
date: 2026-02-04
author: "Fastro Team"
tags: ["middleware", "tutorial"]
---

Deno KV is a revolutionary key-value database built directly into the Deno runtime. It provides a simple, ACID-compliant storage solution that works seamlessly across local development and Deno Deploy.

Today, we're introducing the `kvMiddleware` for Fastro, making it even easier to integrate persistent storage into your handlers.

## Why use Deno KV?

Traditional databases often require complex connection strings, ORMs, and external hosting. Deno KV eliminates this friction:

- **Zero Config**: No database to install or manage.
- **Global Consistency**: Automatic replication when using Deno Deploy.
- **Atomic Operations**: Support for transactions and atomic updates.
- **TypeScript First**: Full type safety for your keys and values.

## Quick Start

To use KV in your Fastro application, simply register the middleware. It will inject a `kv` instance into the `ctx` object of every request.

```ts
import Fastro from "https://deno.land/x/fastro/mod.ts";
import { kvMiddleware } from "https://deno.land/x/fastro/middlewares/kv/mod.ts";

const app = new Fastro();
app.use(kvMiddleware);

app.get("/counter", async (req, ctx) => {
  const result = await ctx.kv.get(["counter"]);
  const nextValue = (result.value ?? 0) + 1;
  await ctx.kv.set(["counter"], nextValue);
  
  return { counter: nextValue };
});

await app.serve();
```

> **IMPORTANT**: Make sure to run your app with the `--unstable-kv` flag:
> `deno run --unstable-kv --allow-net main.ts`

## Persistent by Default

By default, `kvMiddleware` opens the default database for your environment. If you need to point to a specific database file, you can use the factory function:

```ts
import { createKvMiddleware } from "https://deno.land/x/fastro/middlewares/kv/mod.ts";

// Point to a local database file
app.use(createKvMiddleware("./my-database.db"));
```

## 100% Coverage & Reliability

Like all official Fastro middlewares, the `kvMiddleware` is 100% tested. We've verified its behavior in various scenarios:
- Automatic initialization on the first request.
- Efficient singleton pattern (reusing the same connection).
- Graceful error handling when the `--unstable-kv` flag is missing.

Check out the [Source Code](/middlewares/kv/kv.ts) or dive into the [Documentation](/docs#deno-kv) to learn more.
