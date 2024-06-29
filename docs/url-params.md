---
title: "URL Params"
description: The application that return simple url params
image: https://fastro.deno.dev/fastro.png
previous: json
next: url-query
---

```ts
import fastro, { HttpRequest } from "https://fastro.deno.dev/mod.ts";

const f = new fastro();

f.get("/:user", (req: HttpRequest) => {
    const data = { user: req.params?.user };
    return Response.json(data);
});

await f.serve();
```

You can access with: `http://localhost:8000/agus`
