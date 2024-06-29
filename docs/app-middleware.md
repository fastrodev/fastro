---
title: "Application Middleware"
description: The application that use app middleware
image: https://fastro.deno.dev/fastro.png
previous: url-query
next: route-middleware
---

```ts
import fastro, { Context, HttpRequest } from "https://fastro.deno.dev/mod.ts";

const f = new fastro();

const m = (req: HttpRequest, ctx: Context) => {
    req.ok = true;
    ctx.msg = "hello";
    ctx.getTitle = () => "oke";
    return ctx.next();
};

f.use(m);

f.get("/", (req: HttpRequest, ctx: Context) => {
    return {
        ok: req.ok,
        msg: ctx.msg,
        title: ctx.getTitle(),
    };
});

await f.serve();
```
