---
title: "Understanding Fastro Modules: Manual vs. Automatic Loading"
description: "Master the architecture of Fastro by learning how to create, organize, and register modules for scalable applications."
date: 2026-02-04
author: "Fastro Team"
---

As your application grows, keeping all your routes and logic in a single file becomes unmanageable. Fastro's **Module System** is designed to help you split your application into clean, isolated components that can be loaded manually or automatically.

In Fastro, a "Module" is essentially a Middleware. It can be a simple function or a complex Router that encapsulates multiple routes.

## 1. Creating Your First Module

Let's create a module that handles user authentication logic. We'll place it in a dedicated directory.

**File: `modules/auth/mod.ts`**
```ts
import { createRouter } from "https://deno.land/x/fastro/mod.ts";

const auth = createRouter()
  .get("/login", () => "Login Page")
  .post("/login", (req) => "Processing Login...");

// Export as default OR as a named export matching the folder name ('auth')
export default auth.build();
```

## 2. Using Modules Manually

Manual loading gives you full control over when and in what order your modules are initialized. This is ideal for small projects or when you have complex dependency requirements.

**File: `main.ts`**
```ts
import Fastro from "https://deno.land/x/fastro/mod.ts";
import authModule from "./modules/auth/mod.ts";

const app = new Fastro();

// Manually register the module as a middleware
app.use(authModule);

await app.serve();
```

## 3. Using Modules Automatically (Autoload)

The `autoRegisterModules` utility is the "magic" feature for larger applications. It scans your `modules/` directory and mounts everything for you based on a few simple conventions.

### How to set it up:

1.  Structure your project with a `modules/` folder.
2.  Inside each sub-folder, create a `mod.ts` file.
3.  Export your middleware/router as the **default export** or a **named export** that matches the folder name.

**File: `main.ts`**
```ts
import Fastro, { autoRegisterModules } from "https://deno.land/x/fastro/mod.ts";

const app = new Fastro();

// This one line replaces all manual imports!
await autoRegisterModules(app);

await app.serve();
```

### Loading Order & Rules

Fastro doesn't just load modules randomly. It follows a specific priority:
- **`index`**: If a folder named `index` exists, it is loaded **first**. Use this for core initializations.
- **Alphabetical**: Other folders are loaded alphabetically.
- **`profile`**: If a folder named `profile` exists, it is loaded **last**. This is perfect for 404 handlers or final cleanup logic.

## 4. Why use Autoload?

- **Zero Maintenance**: Just drop a new folder into `modules/`, and it's live. No need to touch `main.ts`.
- **Clean Architecture**: Encourages a directory-based structure where business logic is separated from server setup.
- **Scalability**: Whether you have 2 modules or 200, your `main.ts` remains clean and readable.

## Summary

Use **Manual Loading** for absolute control and simplicity in small apps. Switch to **Automatic Loading** when your project grows and you want to leverage a cleaner, more scalable folder-based architecture.

---

Ready to modularize? Check out our [Documentation](/DOCS.md#-automatic-module-loading) for more technical details.
