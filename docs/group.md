---
title: "Grouping Modules"
description: How to organize and group related routes into reusable modules
image: https://fastro.deno.dev/fastro.png
previous: kv
next: deploy
---

Fastro allows you to organize your routes into reusable modules, making your
application more maintainable and modular.

## Table of contents

## Basic Module Structure

A module is a function that takes a Fastro instance and returns it after adding
routes:

```typescript
const myModule = (f: Fastro) => {
  return f.get("/path", handler);
};
```

## Complete Example

The example shows how to create and register multiple modules for different
parts of your API.

```typescript
import fastro, { Fastro } from "@app/mod.ts";

const f = new fastro();

// Simple hello module
const helloModule = (f: Fastro) => {
  return f.get("/", () => "Hello World")
    .get("/about", () => "About page");
};

// User API module with RESTful endpoints
const userModule = (f: Fastro) => {
  const basePath = "/api/users";
  return f
    .get(basePath, () => ({ message: "Get all users" }))
    .get(`${basePath}/:id`, (req) => ({ message: `Get user ${req.params.id}` }))
    .post(basePath, () => ({ message: "User created" }))
    .put(
      `${basePath}/:id`,
      (req) => ({ message: `User ${req.params.id} updated` }),
    )
    .delete(
      `${basePath}/:id`,
      (req) => ({ message: `User ${req.params.id} deleted` }),
    );
};

// Product API module with RESTful endpoints
const productModule = (f: Fastro) => {
  const basePath = "/api/products";
  return f
    .get(basePath, () => ({ message: "Get all products" }))
    .get(
      `${basePath}/:id`,
      (req) => ({ message: `Get product ${req.params.id}` }),
    )
    .post(basePath, () => ({ message: "Product created" }))
    .put(
      `${basePath}/:id`,
      (req) => ({ message: `Product ${req.params.id} updated` }),
    )
    .delete(
      `${basePath}/:id`,
      (req) => ({ message: `Product ${req.params.id} deleted` }),
    );
};

// Register all modules
await f.group(helloModule);
await f.group(userModule);
await f.group(productModule);

// Start the server
await f.serve({ port: 8000 });
```

## Benefits

- **Organization**: Keep related routes together
- **Reusability**: Modules can be shared across applications
- **Maintainability**: Easier to manage large applications
- **Separation of Concerns**: Each module handles specific functionality
