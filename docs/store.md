---
title: Store
description: Store
image: https://fastro.deno.dev/fastro.png
previous: deploy
next: benchmarks
---

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
