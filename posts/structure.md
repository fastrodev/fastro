---
title: "Project Structure: Organizing Your Fastro Application"
description: "Learn the recommended project layout for Fastro applications, from simple scripts to scalable multi-module architectures."
date: 2026-02-04
author: "Fastro Team"
tags: ["general", "tutorial"]
---

Fastro is built on the principle of "simple enough for a script, robust enough for an enterprise app." Because it has zero dependencies and uses standard Web APIs, you have total freedom in how you organize your code. However, following a standard structure makes your application easier to maintain and collaborate on.

Here is the recommended layout for a professional Fastro project.

## 1. The Minimalist Approach (Single File)

For small tools, microservices, or prototypes, a single file is often all you need.

**File: `main.ts`**
```ts
import Fastro from "https://deno.land/x/fastro/mod.ts";

const app = new Fastro();

app.get("/", () => "Hello Fastro!");

await app.serve({ port: 8000 });
```

## 2. The Standard Scalable Layout

As your project grows, we recommend adopting a directory-based structure. This is the layout used by the Fastro core repository itself:

```text
my-fastro-app/
├── modules/           # Business logic & routes grouped by feature
│   ├── users/
│   │   └── mod.ts     # User-related routes
│   └── auth/
│       └── mod.ts     # Auth-related routes
├── middlewares/       # Custom application-wide middlewares
│   └── auth.ts
├── public/            # Static assets (images, css, js)
│   └── index.html
├── main.ts            # Entry point & server configuration
└── deno.json          # Deno configuration & dependencies
```

### Breakdown of Folders

#### `modules/`
This is where the heart of your application lives. Instead of a giant routes file, you group logic by feature. Each module should export a middleware or a `RouteBuilder`. 
- **Pro Tip:** Use `autoRegisterModules(app)` in your `main.ts` to automatically load everything in this folder.

#### `middlewares/`
If you have logic that needs to run across many routes (like session validation, request transformation, or custom headers), place them here. This keeps your modules focused purely on business logic.

#### `public/`
Standard directory for static content. You can serve this folder using the built-in static middleware:
```ts
import { staticFiles } from "https://deno.land/x/fastro/middlewares/static/mod.ts";
app.use(staticFiles("/static", "./public"));
```

#### `main.ts`
The gatekeeper of your application. This is where you:
1. Initialize the `Fastro` instance.
2. Register global middlewares.
3. Setup module loading (manual or automatic).
4. Define the server port and hostname.

## 3. Best Practices for Structure

### Use `mod.ts` for Entry Points
In the Deno ecosystem, `mod.ts` is the convention for the main entry point of a directory or module. If you are creating a complex user module, put the logic in sub-files but export the final middleware from `mod.ts`.

### Keep Middlewares Lean
Middlewares should do one thing well. If a middleware starts becoming too complex, consider splitting it or moving the logic into a dedicated utility file.

### Separation of Concerns
Keep your data access logic (DB queries) separate from your route handlers. This makes it much easier to write unit tests for your business logic without having to mock the entire HTTP context.

## Conclusion

Whether you prefer a flat structure or a deeply nested one, Fastro adapts to your style. By starting with the standard layout, you ensure that your application remains "Fastro-fast" both in runtime performance and developer productivity.

---

Ready to build? Learn more about [Automatic Module Loading](/posts/modules.md) or explore our [Built-in Middlewares](/MIDDLEWARES.md).
