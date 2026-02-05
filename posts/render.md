---
title: "Fastro Rendering Engine: Bridging SSR and Client Hydration"
description: "Discover how Fastro's render middleware and build utilities work together to provide a seamless React SSR experience with automatic client-side hydration."
date: 2026-02-05
author: "Fastro Team"
tags: ["react", "ssr", "hydration", "esbuild"]
---

# Fastro Rendering Engine: Bridging SSR and Client Hydration

Modern web development demands the performance of Server-Side Rendering (SSR) combined with the interactivity of client-side React. Fastro achieves this balance through its powerful `render` middleware and a sophisticated set of `build` utilities that automate the boring parts of full-stack development.

In this post, we'll explore how these two components work together to turn a simple React component into a fully interactive web application.

## 1. The `render` Middleware

The `render` middleware is the heart of Fastro's UI layer. When applied, it injects two helpful methods into the `Context` object: `ctx.render` and `ctx.renderToString`.

### Key Features:
- **Zero Configuration SSR**: Pass a React component to `ctx.render`, and Fastro handles the HTML scaffolding.
- **Initial Props Injection**: Data fetched on the server can be passed to the client automatically via a JSON payload.
- **Developer Experience (DX)**: Includes built-in **Hot Module Replacement (HMR)** and **Progressive Web App (PWA)** support.

```typescript
import Fastro from "./mod.ts";
import { createRenderMiddleware } from "./middlewares/render/render.ts";
import { App } from "./modules/index/App.tsx";

const app = new Fastro();

// Enable the rendering engine
app.use(createRenderMiddleware());

app.get("/", (req, ctx) => {
  return ctx.render(<App title="Hello Fastro!" />, {
    module: "index",
    title: "Home Page",
    initialProps: { message: "Welcome from SSR!" }
  });
});

await app.serve();
```

## 2. Automatic Hydration with Build Utilities

Rendering HTML on the server is only half the battle. To make the page interactive, React needs to "hydrate" the DOM on the client. Typically, this requires setting up a complex build pipeline with Webpack or Vite. 

Fastro's `build` utilities remove this friction by:
1.  **Scanning Modules**: Automatically detecting directory structures (e.g., `modules/index/App.tsx`).
2.  **Generating Hydration Code**: Creating a temporary `client.tsx` that calls `hydrateRoot`.
3.  **Fast Bundling**: Using `esbuild` with native Deno support to bundle the client-side code into `public/js/`.

### The Convention
If you place an `App.tsx` file inside a module folder, the build system recognizes it as a hydration candidate.

```text
modules/
  index/
    main.ts    <-- Server logic
    App.tsx     <-- React Root Component
```

## 3. High Performance with Hot Reloading

When developing locally, Fastro starts a file watcher that monitors your React components. When a change is detected:
1.  The `build` utility re-bundles the specific module.
2.  The `render` middleware detects the new build via a `.build_done` marker.
3.  A WebSocket message is sent to all connected browsers to trigger an immediate reload (HMR).

## 4. Production Ready PWAs

Fastro's render engine isn't just for development. By passing a simple flag to the middleware, you can turn your application into a PWA with an automatically managed Service Worker and precaching strategy.

```typescript
app.use(createRenderMiddleware({
  pwa: true,
  pwaConfig: {
    cacheName: "fastro-app-v1",
    fetchStrategy: "network-first"
  }
}));
```

## Conclusion

Fastro's rendering system is designed to stay out of your way. By combining the `render` middleware for SSR with `build` utilities for hydration, you can focus on building your application's UI instead of wrestling with build tools.

Whether you're building a simple landing page or a complex dashboard, the combination of Deno, esbuild, and React provides a modern, high-performance foundation.

---

Ready to try it out? Check out our [Showcase](/SHOWCASE.md) to see real-world examples.
