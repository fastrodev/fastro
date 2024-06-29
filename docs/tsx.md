---
title: "TSX Page"
description: How to setup a page with TSX
image: https://fastro.deno.dev/fastro.png
previous: static
next: tsx-component
---

Create `hello.tsx` file:

```ts
import fastro, { Context, HttpRequest } from "https://fastro.deno.dev/mod.ts";

const f = new fastro();

f.get(
    "/",
    (_req: HttpRequest, ctx: Context) => {
        return ctx.render(<h1>Hello, jsx!</h1>);
    },
);

await f.serve();
```
