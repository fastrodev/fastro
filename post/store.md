---
title: "Store: Key and Value Map with TTL"
description: "Store: Key and Value Map with TTL. A key-value map with time-to-live (TTL) is a data structure that associates keys with values, similar to a regular map or dictionary"
image: https://fastro.deno.dev/store.png
author: Admin
date: 09/17/2024
---

A key-value map with time-to-live (TTL) is a data structure that associates keys
with values, similar to a regular map or dictionary. However, each key-value
pair also has an expiration time, after which the pair is automatically removed
from the map. This allows for efficient storage and retrieval of data that is
only relevant for a limited time period.

## Key Features

- Automatic expiration of key-value pairs based on TTL
- Efficient storage of time-sensitive data
- Retrieval of unexpired pairs based on keys
- Ability to set TTL when adding or updating pairs
- Removal of expired pairs during regular cleanup
- Autosave to GitHub repository

## Use Cases

- Caching frequently accessed data with a limited lifetime
- Tracking user sessions or other short-term user data
- Storing temporary configuration settings or feature flags
- Implementing rate limiting or throttling for APIs
- Maintaining leaderboards or other temporary rankings

## Examples

You can find this code on this
[url](https://raw.githubusercontent.com/fastrodev/fastro/main/examples/store.ts).

```ts
import fastro, { Context, HttpRequest } from "@app/mod.ts";

const f = new fastro();

// set default value for the store
f.store.set("hello", "hello world");

f.post(
    "/",
    (_req: HttpRequest, ctx: Context) => {
        // update default value
        ctx.store.set("hello", "hello world v2");
        return ctx.send("Helo world", 200);
    },
);

f.post(
    "/ttl",
    (_req: HttpRequest, ctx: Context) => {
        // update default value with TTL
        ctx.store.set("hello", "world", 1000);
        return ctx.send("ttl", 200);
    },
);

f.post(
    "/commit",
    async (_req: HttpRequest, ctx: Context) => {
        // save store to github
        await ctx.store.commit();
        return ctx.send("commit", 200);
    },
);

f.get(
    "/",
    async (_req: HttpRequest, ctx: Context) => {
        // get the value
        const res = await ctx.store.get("hello");
        return Response.json({ value: res });
    },
);

f.post(
    "/destroy",
    async (_req: HttpRequest, ctx: Context) => {
        // destroy file
        await ctx.store.destroy();
        return ctx.send("destroy", 200);
    },
);

await f.serve();
```
