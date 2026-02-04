# Contributing to Fastro

Thank you for your interest in contributing to Fastro! This guide will help you
get started with contributing to the framework, with a specific focus on
creating middlewares.

## How to Create a Middleware

Middlewares in Fastro are simple functions that allow you to intercept and
modify requests and responses.

### 1. Basic Middleware Structure

A middleware is a function that receives the `Request`, the Fastro `Context`
(`ctx`), and a `next` function. To allow the request to proceed to the next
handler, you must return `next()`.

```typescript
import { Context, Next } from "./core/types.ts";

export function myMiddleware(req: Request, ctx: Context, next: Next) {
  console.log(`${req.method} ${ctx.url.pathname}`);

  // Perform logic here...

  // Return next() to continue execution
  return next();
}
```

### 2. Registering Middleware

You can register middleware globally or for specific routes.

```typescript
import app from "./mod.ts";
import { myMiddleware } from "./middlewares/my_middleware.ts";

// Global middleware
app.use(myMiddleware);

app.get("/", () => "Hello World");

app.serve();
```

### 3. Practical Example: Request Logger & State

Here is a simple logger that also attaches a timestamp to the request state:

```typescript
import { Context, Next } from "./core/types.ts";

export function logger(req: Request, ctx: Context, next: Next) {
  const start = Date.now();

  // Attach data to the shared context state
  ctx.state.startTime = start;

  console.log(
    `[${new Date().toISOString()}] ${req.method} ${ctx.url.pathname}`,
  );

  return next();
}
```

## Contributing Modules

Fastro's modular architecture allows you to contribute entire sets of
functionality as modules. To create a module:

1. Create a directory in `modules/`.
2. Add a `mod.ts` with a **default export** function.
3. Use `createRouter` to define your module's routes.

```typescript
import { createRouter } from "../../mod.ts";

const myModule = createRouter()
  .get("/hello", () => "Hello from module!");

export default myModule.build();
```

## Development Workflow

1. **Fork the repository**
2. **Clone your fork**
3. **Create a branch**: `git checkout -b feature/my-new-middleware`
4. **Make your changes**
5. **Run tests**: `deno task test`
6. **Submit a Pull Request**

## Coding Standards

- Use TypeScript.
- Follow the existing code style.
- Add tests for new features or bug fixes.
- Update documentation if necessary.

We look forward to your contributions!
