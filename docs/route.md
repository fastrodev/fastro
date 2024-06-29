---
title: "Routing"
description: The application that return simple route
image: https://fastro.deno.dev/fastro.png
previous: json
next: url-params
---

```ts
import fastro from "https://fastro.deno.dev/mod.ts";

const f = new fastro();

f.get("/", () => ({ text: "Hello get" }));
f.post("/", () => ({ text: "Hello post" }));
f.put("/", () => ({ text: "Hello put" }));
f.delete("/", () => ({ text: "Hello delete" }));

await f.serve();
```
