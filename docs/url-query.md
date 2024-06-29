---
title: "URL Query"
description: The application that return simple url query
image: https://fastro.deno.dev/fastro.png
previous: url-params
next: app-middleware
---

```ts
import fastro, { HttpRequest } from "https://fastro.deno.dev/mod.ts";

const f = new fastro();

f.get("/:user", (req: HttpRequest) => {
    const data = { user: req.params?.user, title: req.query?.title };
    return Response.json(data);
});

await f.serve();
```

You can access with: `http://localhost:8000/agus?title=head`
