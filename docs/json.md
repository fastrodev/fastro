---
title: "Hello JSON"
description: The application that return simple JSON
image: https://fastro.deno.dev/fastro.png
previous: hello-context
next: hello-context
---

```ts
import fastro from "https://fastro.deno.dev/mod.ts";

const f = new fastro();

f.get("/", () => ({ text: "Hello json" }));

await f.serve();
```
