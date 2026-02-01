# 📖 Fastro Documentation

Fastro is a high-performance, minimalist web framework for Deno. This
documentation covers everything you need to build scalable, high-speed
applications.

---

## 📑 Table of Contents

- [🚀 Getting Started](#-getting-started)
- [🛣️ Routing](#️-routing)
- [⚡ Responses](#-responses)
- [🧩 Middleware](#-middleware)
- [🏗️ Modular Routing (Router)](#️-modular-routing-router)
- [📂 Automatic Module Loading](#-automatic-module-loading)
- [🛠️ Context (`ctx`)](#️-context-ctx)
- [🏎️ Performance Features](#️-performance-features)

---

## 🚀 Getting Started

To create a basic server, import the default export from `mod.ts` and create a
new instance.

```ts
import Fastro from "./mod.ts";

const app = new Fastro();
app.get("/", () => "Hello Fastro!");

await app.serve({ port: 8000 });
```

### Server Configuration

The `.serve()` method accepts the standard `Deno.serve` options plus an optional
`cacheSize`:

| Option      | Type     | Default | Description                                     |
| :---------- | :------- | :------ | :---------------------------------------------- |
| `port`      | `number` | `8000`  | The port to listen on.                          |
| `cacheSize` | `number` | `10000` | Max entries for the route matching cache (LRU). |

---

## 🛣️ Routing

Fastro supports standard HTTP methods: `get()`, `post()`, `put()`, and
`delete()`.

### Basic Routes

```ts
app.get("/welcome", () => "Welcome!");
app.post("/submit", () => new Response("Created", { status: 201 }));
```

### Path Parameters

Capture segments of the URL using the `:name` syntax. They are accessible via
`ctx.params`.

```ts
app.get("/user/:id", (req, ctx) => {
  return `User ID: ${ctx.params.id}`;
});
```

### Query Parameters

Query parameters are automatically parsed and available via `ctx.query`.

```ts
// Request: /search?q=deno&limit=10
app.get("/search", (req, ctx) => {
  const { q, limit } = ctx.query;
  return `Searching for ${q} (limit: ${limit})`;
});
```

### Advanced Patterns

Use `URLPattern` for complex requirements like regex or specific host matching.

```ts
const pattern = new URLPattern({ pathname: "/static/:file.png" });
app.get(pattern, (req, ctx) => {
  return `Requested image: ${ctx.params.file}`;
});
```

---

## ⚡ Responses

Handlers in Fastro are highly flexible. You can return:

| Return Type | Behavior                   | Example                |
| :---------- | :------------------------- | :--------------------- |
| `string`    | Sent as `text/plain`       | `() => "Hello"`        |
| `object`    | Sent as `application/json` | `() => ({ id: 1 })`    |
| `Response`  | Standard Web Response      | `() => new Response()` |
| `Promise`   | Awaited automatically      | `async () => "Done"`   |

```ts
// Async JSON response
app.get("/api/data", async () => {
  const data = await db.fetch();
  return { data, timestamp: Date.now() };
});
```

---

## 🧩 Middleware

Middlewares execute in the order they are registered. Signature:
`(req, ctx, next)`.

### Global Middleware

```ts
app.use((req, ctx, next) => {
  console.log(`${req.method} ${req.url}`);
  return next(); // Always return next() to continue
});
```

### Route-Specific Middleware

Pass middleware functions after the final handler.

```ts
const checkAuth = (req, ctx, next) => {
  return isAuthorized(req)
    ? next()
    : new Response("Forbidden", { status: 403 });
};

app.get("/admin", () => "Sensitive Info", checkAuth);
```

---

## 🏗️ Modular Routing (Router)

The `createRouter` utility helps you group related routes into a single
middleware.

```ts
import { createRouter } from "./mod.ts";

const api = createRouter()
  .get("/v1/ping", () => "pong")
  .get("/v1/user", () => "user data");

// Mount all routes in the builder to the main app
app.use(api.build());
```

---

## 📂 Automatic Module Loading

Automatically scale your application by turning folders into modules.

### Setup

Place your modules in a `modules/` directory at the root:

```
project/
  modules/
    auth/
      mod.ts
    api/
      mod.ts
```

### Registration

```ts
import Fastro, { autoRegisterModules } from "./mod.ts";

const app = new Fastro();
await autoRegisterModules(app);
await app.serve();
```

### Module Authoring

Fastro looks for a **default export** or a named export matching the folder
name.

```ts
// modules/ping/mod.ts
export default (req, ctx, next) => {
  console.log("Ping module loaded!");
  return next();
};
```

---

## 🛠️ Context (`ctx`)

The `ctx` object is the "brain" of the request lifecycle. Property list:

- `ctx.params`: Key-value pair of path parameters.
- `ctx.query`: Key-value pair of query parameters.
- `ctx.url`: A lazy-loaded `URL` object.
- `ctx.remoteAddr`: Client IP and port info.

### Sharing Data (State Management)

Because `ctx` is passed by reference, you can use it to pass data between
middlewares.

```ts
app.use((req, ctx, next) => {
  ctx.state = { startTime: Date.now() };
  return next();
});

app.get("/", (req, ctx) => {
  const elapsed = Date.now() - ctx.state.startTime;
  return `Request handled in ${elapsed}ms`;
});
```

---

## 🏎️ Performance Features

1. **Intelligent LRU Cache**: Fastro remembers which route matches which URL,
   minimizing regex execution.
2. **Fast Root Path**: Root `GET /` requests are optimized to run with nearly
   **0% overhead** over native Deno.
3. **Lazy Parsing**: Heavy objects (like `URL` and `query`) are only parsed if
   your code actually requests them.
