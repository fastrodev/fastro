---
title: "Understanding the Render Middleware (SSR & HMR)"
description: "A comprehensive guide to using the Render Middleware for server-side rendering, initial props management, and development HMR support."
date: 2026-02-07
author: "Fastro Team"
tags: ["render", "ssr", "hmr", "react"]
---

# Introduction to Render Middleware

The **Render Middleware** is a core component of the Fastro framework designed to facilitate Server-Side Rendering (SSR) of React components. It provides a standardized way to render HTML on the server and includes built-in support for Hot Module Replacement (HMR) during development.

## Key Features

1.  **Server-Side Rendering (SSR):** Renders React components into static HTML strings on the server, improving Initial Page Load and Search Engine Optimization (SEO).
2.  **Initial Props Injection:** Safely injects server-side data into the rendered HTML to be used during client-side hydration.
3.  **Development HMR Status:** Automatically monitors file changes and triggers browser reloads to enhance the developer experience.

---

## Installation

To enable the Render Middleware, register it in your application entry point (e.g., `app/main.ts`):

```ts
import { createRenderMiddleware } from "../middlewares/render/render.ts";

// Register the middleware globally
app.use(createRenderMiddleware());
```

---

## Basic Usage

Once the middleware is registered, it attaches a `renderToString` method to the request context (`ctx`).

```ts
app.get("/", (req, ctx) => {
  // Define the component to render
  const component = React.createElement("div", null, "Welcome to Fastro");

  // Render the component with configuration options
  const html = ctx.renderToString(component, { 
    includeDoctype: true,
    title: "Project Home"
  });

  return new Response(html, { 
    headers: { "content-type": "text/html" } 
  });
});
```

---

## Configuration Options

The `ctx.renderToString` method accepts various options to customize the output:

*   **`includeDoctype`**: (Boolean) Whether to prepend `<!DOCTYPE html>` to the response.
*   **`title`**: (String) Sets the document title in the default head template.
*   **`initialProps`**: (Object) Data to be serialized and embedded in the HTML for client consumption.
*   **`module`**: (String) Corresponds to the client-side JavaScript bundle to be loaded.

### Example with Initial Props

```ts
ctx.renderToString(component, {
  initialProps: { 
    user: "Developer", 
    theme: "dark" 
  }
});
```

---

## Development Environment (HMR)

In non-production environments, the middleware automatically:
1.  Injects a lightweight HMR client script into the rendered HTML.
2.  Establishes a WebSocket connection to monitor build status.
3.  Triggers a page reload whenever a change is detected in the project files.

In **production mode**, these features are automatically disabled to ensure optimal performance.

---

## Summary

The Render Middleware provides an efficient bridge between server-side logic and client-side presentation. By handling SSR and HMR out of the box, it allows developers to focus on building features rather than managing infrastructure.
