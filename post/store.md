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

## Show me the code

You can run this code with: `deno run -r --env -A store.ts`

```ts
import { Store } from "https://fastro.dev/core/map/mod.ts";

// init store with options.
// you have to prepare the repository
// and GITHUB_TOKEN if you want to save
// to Github repository
const store = new Store({
    owner: "fastrodev",
    repo: "fastro",
    branch: "store",
    path: "modules/store/store.json",
    token: Deno.env.get("GITHUB_TOKEN"),
});

// set key and value
store.set("key1", "hello");

// set key and value with TTL
store.check("key2").set("key2", "hello2", 4000);

// Check, set, and save it to the repository.
// Please note that committing takes some time.
// It takes around 3 seconds to save to GitHub.
await store.check("key3").set("key3", "hello3").commit();

// get the value from the in-memory map
const r1 = await store.get("key1");
console.log(r1); // hello
const r2 = await store.get("key2");
console.log(r2); // hello2

// wait 2s to make sure the key is already expired
await new Promise((resolve) => setTimeout(resolve, 5000));
const r3 = await store.get("key2");
console.log(r3); // undefined

const r4 = await store.get("key3");
console.log(r4); // hello3

// clear the map
store.clear();

// delete the map
store.delete("key1");
store.delete("key3");

// delete the map and the github file
await store.destroy();
```

## Example of use in web app

Fastro already integrate that class via `Context`. You can find this code on
[examples/store.ts](https://raw.githubusercontent.com/fastrodev/fastro/main/examples/store.ts)

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
    (_req: HttpRequest, ctx: Context) => {
        // get the value
        const res = ctx.store.get("hello");
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
