---
title: "Hello World"
description: The application for creating a simple route
image: https://fastro.deno.dev/fastro.png
previous: structure
next: hello-context
---

```ts
import fastro from "https://fastro.deno.dev/mod.ts";

const f = new fastro();

f.get("/", () => "Hello, World!");

await f.serve();
```
