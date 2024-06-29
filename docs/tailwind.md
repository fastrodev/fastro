---
title: "Tailwind Middleware"
description: The application that use tailwind middleware
image: https://fastro.deno.dev/fastro.png
previous: markdown
next: static
---

```ts
import fastro from "https://fastro.deno.dev/mod.ts";
import { tailwind } from "https://fastro.deno.dev/middleware/tailwind/mod.ts";

const f = new fastro();
f.use(tailwind());
await f.serve();
```
