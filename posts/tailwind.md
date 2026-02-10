---
title: "Tailwind Middleware for Fastro"
description: "On-the-fly Tailwind/PostCSS middleware for Fastro — usage, config, and deployment tips."
date: 2026-02-10
author: "Fastro Team"
tags: ["middleware","tailwind"]
---

This middleware compiles Tailwind/PostCSS on the fly (in development) or serves a prebuilt CSS file in production. It exposes a simple function `tailwind(pathname = "/styles.css", staticDir = "/static")` that returns a middleware compatible with Fastro's middleware pipeline.

Why use it?

- Fast feedback during development — edit Tailwind sources and the middleware compiles them.
- Simple deployment path: provide a prebuilt `/public/css/styles.css` in production and the middleware will serve it.

Quick usage

1. Import and register the middleware in `app/main.ts` or your middleware stack:

```ts
import { tailwind } from "../middlewares/tailwind/tailwind.ts";

// register at the top of the stack so the CSS path is served early
app.use(tailwind('/styles.css', '/static'));
```

2. Include the stylesheet in your pages:

```html
<link rel="stylesheet" href="/styles.css">
```

Configuration notes

- `pathname` (default `/styles.css`): the URL path that will serve the generated CSS.
- `staticDir` (default `/static`): the directory where your Tailwind sources live (the middleware looks for `css/tailwind.css` under this dir during dev).
- In production the middleware will try to serve `./public/css/<filename>` first (where `<filename>` is the last segment of `pathname`). If found, it serves the prebuilt file with long cache headers.

Code

- Source: [/middlewares/tailwind/tailwind.ts](/middlewares/tailwind/tailwind.ts)

Notes and tips

- The middleware uses PostCSS and Tailwind via npm shims (Deno `npm:` imports). Ensure your environment has network access when compiling in dev.
- For CI or constrained environments, prebuild CSS and place it under `/public/css/styles.css` to avoid on-the-fly compilation.

Examples and advanced usage

- You can mount the middleware at a different path, e.g., `tailwind('/css/app.css')` and reference that path in templates.
- Combine with a file watcher to recompile on file changes for faster dev feedback loops.

---

If you'd like, I can add an example `tailwind.css` starter file in `public/` or `static/css/` and wire a simple `deno task` to build it.
