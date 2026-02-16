# Fastro Documentation

![Fastro Start](https://storage.googleapis.com/replix-394315-file/uploads/start_h.jpg)

Fastro is a high-performance, minimalist web framework for Deno. This
documentation covers everything you need to build scalable, high-speed
applications.

## Table of Contents

- [Getting Started](#getting-started)
- [Routing](#routing)
- [Responses](#responses)
- [Middleware](#middleware)
- [Render Middleware](#render-middleware)
- [Tailwind Middleware](#tailwind-middleware)
- [Modular Routing (Router)](#modular-routing-router)
- [Static Files](#static-files)
- [Body Parser](#body-parser)
- [CORS](#cors)
- [JWT](#jwt)
- [Cookie](#cookie)
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

For detailed configuration (origins, headers, methods), see the [CORS guide](/posts/cors).


## Cookie

Fastro provides a lightweight cookie middleware that parses incoming `Cookie` headers and exposes them on the request `ctx` as `ctx.cookies`. It also collects `Set-Cookie` values when handlers call `ctx.setCookie()` and appends them to the response.

### Usage

```ts
import Fastro from "./mod.ts";
import { cookieMiddleware } from "./middlewares/cookie/mod.ts";

const app = new Fastro();
app.use(cookieMiddleware);

app.get("/dashboard", (req, ctx) => {
  const user = ctx.cookies?.user;
  if (!user) return new Response(null, { status: 303, headers: { Location: "/signin" } });
  return `Welcome ${user}`;
});

app.post("/signin", (req, ctx) => {
  // after validating credentials
  ctx.setCookie("user", "alice@example.com", { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 });
  return new Response(null, { status: 303, headers: { Location: "/dashboard" } });
});
```

### Notes

- Use `HttpOnly` for session cookies to prevent access from client-side JavaScript.
- Set `Secure` in production when serving over HTTPS and adjust `SameSite` as appropriate.
- Do not store raw passwords or secrets in cookies; prefer opaque session ids or signed tokens.


## JWT

Fastro includes an official JWT (JSON Web Token) middleware for secure authentication using the native Web Crypto API.

### Usage

```ts
import Fastro from "https://deno.land/x/fastro/mod.ts";
import { jwt } from "https://deno.land/x/fastro/middlewares/jwt/mod.ts";

const app = new Fastro();
const SECRET = "your-secret-key";

// Enable JWT globally
app.use(jwt({ secret: SECRET }));

app.get("/", (req, ctx) => {
  // Decoded payload is stored in ctx.state.user
  const user = ctx.state.user;
  return `Hello, ${user.name}!`;
});

await app.serve();
```

### Options

| Option   | Type     | Description                                |
| :------- | :------- | :----------------------------------------- |
| `secret` | `string` | The secret key to sign and verify tokens. |

For more advanced usage like token creation and expiration, see the [JWT guide](/posts/jwt).


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

#### Render Middleware

`createRenderMiddleware()` provides a server-side rendering helper that installs
`ctx.renderToString()` on request context. In development it can also inject
an HMR client script into rendered HTML to support live reload during
component development.

Quick install

- Add the middleware to your app (in `app/main.ts`):

```ts
import { createRenderMiddleware } from "../middlewares/render/render.ts";

app.use(createRenderMiddleware());
```

Basic usage

Handlers can call `ctx.renderToString()` to produce HTML for a component:

```ts
import React from "react";

app.get("/", (req, ctx) => {
  const html = ctx.renderToString(
    React.createElement("div", null, "Hello"),
    { includeDoctype: true, module: "app" },
  );
  return new Response(html, { headers: { "content-type": "text/html" } });
});
```

Options

- `includeDoctype` (boolean): prepend `<!DOCTYPE html>`.
- `includeHead` (boolean): omit or include the default `<head>`.
- `module` (string): when provided, a client script `/js/<module>/client.js` is added.
- `initialProps` (object): serialized to JSON and injected into the page (`<script id="initial" type="application/json">...`).

Development (HMR)

- In non-production (`ENV !== "production"`), the middleware may start a small
  watcher that looks for changes and marks a pending reload. When the HTML is
  rendered in development it includes a small injected HMR client script
  (`/hmr` socket) that will reload the page when the server signals a change.
- The HMR client and watcher are development-only and are not suitable for
  production. The middleware file includes test helpers for deterministic
  testing.

Test helpers

Exported helpers (for tests):

- `_resetWatcherForTests()` — reset watcher state and clear timers.
- `_getHmrClientsForTests()` — access the current client set for assertions.
- `_watchTickForTests()` — trigger a single watcher tick using `Deno.stat`.
- `_watchTickForTestsWithStat(statFn)` — trigger a tick with an injected `stat`.
- `_setLastMtimeForTests(n)` — set internal `lastMtime` to control watcher behavior.

Notes

- The middleware intentionally keeps HMR and watcher logic isolated to make
  production builds deterministic and to keep tests controllable via helpers.
- The file contains a `/* c8 ignore file */` block around the HMR client
  injection because the client string and native timers are difficult to
  instrument deterministically in coverage tools.

Example: server-render + initialProps

```ts
const html = ctx.renderToString(React.createElement(App), {
  includeDoctype: true,
  initialProps: { userId: 123 },
});
```

This will include a safe-escaped JSON payload in the page that your client
bootstrap can read and hydrate with.

### Tailwind Middleware

Fastro provides an optional Tailwind/PostCSS middleware to serve compiled CSS.
It can compile Tailwind on-the-fly during development or serve a prebuilt
file in production.

Quick usage

```ts
import { tailwind } from "../middlewares/tailwind/tailwind.ts";

// Serve CSS at /styles.css using ./static/css/tailwind.css as source
app.use(tailwind('/styles.css', '/static'));
```

Behavior

- Development: compiles `<staticDir>/css/tailwind.css` with PostCSS + Tailwind and returns the CSS.
- Production: attempts to serve `./public/css/<filename>` (where `<filename>` is the last segment of the pathname) with long cache headers; falls back to processing if missing.

See also: [Tailwind middleware blog post](/posts/tailwind) and
[Source](/middlewares/tailwind/tailwind.ts).


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

Automatically scale your application by turning folders into self-contained modules. This is the recommended pattern for large-scale applications where you want to keep your `main.ts` clean and your features isolated.

### The pattern

Fastro scans a top-level `modules/` directory and looks for `mod.ts` files inside each sub-folder. Each module is treated as a middleware.

```
project/
  modules/
    index/       # Loaded FIRST
      mod.ts
    auth/        # Loaded alphabetically
      mod.ts
    api/         # Loaded alphabetically
      mod.ts
    profile/     # Loaded LAST
      mod.ts
```

### Loading Order

Fastro follows a specific priority when loading modules to ensure configuration or prerequisite middlewares run first:
1. **`index/`**: Always loaded first. Ideal for initializing database connections or global error handlers.
2. **Standard Folders**: Loaded alphabetically.
3. **`profile/`**: Always loaded last. Useful for fallback 404 handlers or final logging.

### Implementation Example

To enable this feature, simply call `autoRegisterModules` before serving your app:

```ts
import Fastro, { autoRegisterModules } from "./mod.ts";

const app = new Fastro();

// This will scan /modules and apply them as middlewares
await autoRegisterModules(app);

await app.serve();
```

### Module Authoring

Each `mod.ts` must export a middleware. You can use a **default export** or a **named export** that matches the folder name.

#### Case A: Using Router (Recommended)
This allows your module to define its own encapsulated routes.

```ts
// modules/auth/mod.ts
import { createRouter } from "../../mod.ts";

export default createRouter()
  .post("/login", () => "logged in")
  .get("/logout", () => "logged out")
  .build(); // .build() returns a middleware
```

#### Case B: Custom Middleware
Useful for folder-specific logic like logging or auth-checking specific to that segment.

```ts
// modules/logger/mod.ts
export const logger = (req, ctx, next) => {
  console.log(`[Module Log] ${req.method} ${ctx.url.pathname}`);
  return next();
};
```

### Why use this?

1.  **Isolation**: Changes in the `auth` module don't affect the `api` module.
2.  **Clean main.ts**: Your entry point stays minimalist even as your app grows to hundreds of routes.
3.  **Predictability**: The loading order ensures that your global middlewares (in `index/`) always run before your specific business logic.


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
