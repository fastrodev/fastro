---
title: "Hello World Using Context"
description: The application for creating a simple route using application context
image: https://fastro.deno.dev/fastro.png
previous: hello
next: json
---

```ts
import fastro, { Context, HttpRequest } from "https://fastro.deno.dev/mod.ts";

const f = new fastro();

f.get(
  "/",
  (_req: HttpRequest, ctx: Context) => {
    return ctx.send("Helo world", 200);
  },
);

await f.serve();
```
