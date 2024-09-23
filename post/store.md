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

You can run this code with: `deno run -r --env -A store.ts`.

Create store instance: you have to prepare the repository and GITHUB_TOKEN if
you want to save to Github repository

```ts
import { Store } from "https://fastro.dev/core/map/mod.ts";

const store = new Store({
    owner: "fastrodev",
    repo: "fastro",
    branch: "store",
    path: "modules/store/store.json",
    token: Deno.env.get("GITHUB_TOKEN"),
});
```

Autosave the map to the repository

```ts
await store.sync();
```

Check, set, and save it to the repository. Please note that committing takes
some time. It takes around 3 seconds to save to GitHub.

```ts
store.set("key1", "hello");
store.check("key2").set("key2", "hello2", 4000);
await store.check("key3").set("key3", "hello3").commit();
```

Get the map & simulate the expiration

```ts
const r1 = await store.get("key1");
const r2 = await store.get("key2");
```

Simulate the TTL

```ts
await new Promise((resolve) => setTimeout(resolve, 5000));
const r3 = await store.get("key2"); // undefined
```

Get the file from synced file

```ts
const r4 = await store.get("key3");
```

Clear and delete the map.

```ts
store.clear();

store.delete("key1");
store.delete("key3");
```

Destroy the file.

```ts
await store.destroy();
```

## Example of use in web app

Fastro already integrate that class via `Context`.

You can find the full code on
[examples/store.ts](https://raw.githubusercontent.com/fastrodev/fastro/main/examples/store.ts)

```ts
import fastro, { Context, HttpRequest } from "@app/mod.ts";

const f = new fastro();

// set default value for the store
f.store.set("hello", "hello world");

f.get(
    "/",
    (_req: HttpRequest, ctx: Context) => {
        // get the value
        const res = ctx.store.get("hello");
        return Response.json({ value: res });
    },
);

await f.serve();
```
