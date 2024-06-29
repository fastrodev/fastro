---
title: "Static File"
description: How to setup static file
image: https://fastro.deno.dev/fastro.png
previous: tailwind
next: tsx
---

```ts
import fastro from "https://fastro.deno.dev/mod.ts";

const f = new fastro();

f.static("/static", { folder: "static", maxAge: 90 });

await f.serve();
```
