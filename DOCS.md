# Fastro Documentation

Fastro is a high-performance, minimalist web framework for Deno. This
documentation covers everything you need to build scalable, high-speed
applications.

## Table of Contents

- [Getting Started](#getting-started)
- [Routing](#routing)
- [Responses](#responses)
- [Middleware](#middleware)
- [Modular Routing (Router)](#modular-routing-router)
- [Static Files](#static-files)
- [Body Parser](#body-parser)
- [CORS](#cors)
- [Deno KV](#deno-kv)
- [Automatic Module Loading](#automatic-module-loading)
- [Context (ctx)](#context-ctx)
- [Performance Features](#performance-features)

## Getting Started

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


## Routing

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


## CORS

Fastro provides an official middleware to handle Cross-Origin Resource Sharing.

```ts
import Fastro from "https://deno.land/x/fastro/mod.ts";
import { corsMiddleware } from "https://deno.land/x/fastro/middlewares/cors/mod.ts";

const app = new Fastro();
app.use(corsMiddleware);

app.get("/", () => "CORS enabled!");
await app.serve();
```

For detailed configuration (origins, headers, methods), see the [CORS guide](/blog/cors).


## Deno KV

Fastro provides seamless integration with Deno KV, allowing you to persist data with minimal setup.

### Usage

```ts
import Fastro from "https://deno.land/x/fastro/mod.ts";
import { kvMiddleware } from "https://deno.land/x/fastro/middlewares/kv/mod.ts";

const app = new Fastro();

// Enable KV globally
app.use(kvMiddleware);

app.get("/", async (req, ctx) => {
  // Access the KV instance via ctx.kv
  const result = await ctx.kv.get(["visits"]);
  const count = (result.value ?? 0) + 1;
  await ctx.kv.set(["visits"], count);
  return `Visits: ${count}`;
});

await app.serve();
```

> **Note**: You must run Deno with the `--unstable-kv` flag to use this feature.


## Responses

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


## Middleware

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


## Modular Routing (Router)

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


## Static Files

Fastro provides an optimized official middleware for serving static assets with
production-grade features like LRU caching and SPA support.

### Basic Usage

```ts
import Fastro from "./mod.ts";
import { staticFiles } from "./middlewares/static/mod.ts";

const app = new Fastro();

// Serve files from the 'public' folder at the '/static' URL prefix
app.use(staticFiles("/static", "./public"));

await app.serve();
```

### Options

| Option        | Type      | Default      | Description                                |
| :------------ | :-------- | :----------- | :----------------------------------------- |
| `spaFallback` | `boolean` | `false`      | Serves index file for missing paths (SPA). |
| `indexFile`   | `string`  | `index.html` | The default file to serve for directories. |

### Single Page Application (SPA) Support

For React, Vue, or Svelte apps, enable `spaFallback` to ensure client-side
routing works correctly after a page refresh.

```ts
app.use(staticFiles("/", "./dist", { spaFallback: true }));
```

### Performance & Caching

- **Production Mode**: When `ENV=production`, Fastro enables an **LRU Cache**
  (limit: 100 files) and sets `Cache-Control` headers for maximum speed.
- **Development Mode**: Cache is disabled with `no-cache` headers to ensure you
  always see your latest changes.


## Body Parser

The official `bodyParser` middleware parses incoming request bodies (POST, PUT, PATCH) based on the `Content-Type` header.

### Usage

```ts
import Fastro from "./mod.ts";
import { bodyParser } from "./middlewares/bodyparser/mod.ts";

const app = new Fastro();
app.use(bodyParser);

app.post("/submit", (req, ctx) => {
  const { json, formData, text } = ctx.state;
  return { received: json || text || "data" };
});

await app.serve();
```

### Supported Types

- `application/json`: Accessible via `ctx.state.json`.
- `multipart/form-data`: Accessible via `ctx.state.formData`.
- `application/x-www-form-urlencoded`: Accessible via `ctx.state.formData`.
- `text/*`: Accessible via `ctx.state.text`.
- Others: Accessible as raw `Uint8Array` via `ctx.state.bytes`.


## Automatic Module Loading

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

For a deeper dive into module patterns, check our [Modules Guide](/blog/modules).


## Context (ctx)

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


## Performance Features

1. **Intelligent LRU Cache**: Fastro remembers which route matches which URL,
   minimizing regex execution.
2. **Fast Root Path**: Root `GET /` requests are optimized to run with nearly
   **0% overhead** over native Deno.
3. **Lazy Parsing**: Heavy objects (like `URL` and `query`) are only parsed if
   your code actually requests them.
