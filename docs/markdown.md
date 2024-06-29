---
title: "Markdown Middleware"
description: The application that use markdown middleware
image: https://fastro.deno.dev/fastro.png
previous: route-middleware
next: tailwind
---

```ts
import fastro from "https://fastro.deno.dev/mod.ts";
import markdown from "https://fastro.deno.dev/middleware/markdown/mod.tsx";

const f = new fastro();
f.use(markdown());

await f.serve();
```

Create `post/hello.md` file.

````md
---
title: "Hello"
description: "Hello markdown"
image: https://fastro.deno.dev/fastro.png
author: Fastro
date: 11/15/2023
tags: ["hello", "hi"]
---

# Hello, world!

| Type | Value |
| ---- | ----- |
| x    | 42    |

```js
console.log("Hello, world!");
```
````

Default page: `http://localhost:8000/blog/hello`
