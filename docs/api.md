---
title: "Fastro API Documentation"
description: "Complete API reference for Fastro - covering server setup, routing, middleware, SSR, stores, and more"
image: https://fastro.deno.dev/fastro.png
---

## Table of contents

## Core Server

### Fastro Class

The main server class that implements the `Fastro` interface.

```typescript
import fastro from "https://fastro.deno.dev/mod.ts";

const f = new fastro(options?: Record<string, any>);
```

#### Constructor Options

- `options` - Optional configuration object for server initialization

#### Methods

##### `serve(options?: { port?: number; onListen?: ListenHandler }): Promise<void>`

Start the HTTP server.

```typescript
await f.serve({
  port: 8000,
  onListen: ({ hostname, port }) => {
    console.log(`Server running on ${hostname}:${port}`);
  },
});
```

##### `shutdown(): void`

Gracefully shutdown the server.

```typescript
await f.shutdown();
```

##### `group(mf: ModuleFunction): Promise<Fastro>`

Group related routes and handlers into modules.

```typescript
const userModule = (f: Fastro) => {
  return f.get("/users", () => "User list")
    .post("/users", () => "Create user");
};

await f.group(userModule);
```

##### `use(...handlers: Handler[]): Fastro`

Add global middleware.

```typescript
f.use((req, ctx) => {
  console.log(`${req.method} ${req.url}`);
  return ctx.next();
});
```

##### `static(path: string, options?: StaticOptions): Fastro`

Serve static files.

```typescript
f.static("/static", {
  folder: "public",
  maxAge: 86400,
  referer: true,
});
```

**StaticOptions:**

- `folder?: string` - Static files directory (default: "static")
- `maxAge?: number` - Cache control max-age in seconds (default: 0)
- `referer?: boolean` - Check referer header (default: false)

## Routing

### HTTP Methods

#### `get(path: string, ...handlers: Handler[]): Fastro`

Handle GET requests.

```typescript
f.get("/", () => "Hello World");
f.get("/users/:id", (req) => `User ${req.params?.id}`);
```

#### `post(path: string, ...handlers: Handler[]): Fastro`

Handle POST requests.

```typescript
f.post("/users", async (req) => {
  const body = await req.parseBody<{ name: string }>();
  return { message: `Created user ${body.name}` };
});
```

#### `put(path: string, ...handlers: Handler[]): Fastro`

Handle PUT requests.

```typescript
f.put("/users/:id", (req) => `Update user ${req.params?.id}`);
```

#### `patch(path: string, ...handlers: Handler[]): Fastro`

Handle PATCH requests.

```typescript
f.patch("/users/:id", (req) => `Patch user ${req.params?.id}`);
```

#### `delete(path: string, ...handlers: Handler[]): Fastro`

Handle DELETE requests.

```typescript
f.delete("/users/:id", (req) => `Delete user ${req.params?.id}`);
```

#### `options(path: string, ...handlers: Handler[]): Fastro`

Handle OPTIONS requests.

```typescript
f.options("/api/*", () =>
  new Response(null, {
    headers: {
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  }));
```

#### `head(path: string, ...handlers: Handler[]): Fastro`

Handle HEAD requests.

```typescript
f.head("/health", () => new Response(null, { status: 200 }));
```

### Route Parameters

Routes support URL parameters using the `:param` syntax:

```typescript
f.get("/users/:id", (req) => {
  const userId = req.params?.id;
  return `User ID: ${userId}`;
});

f.get("/posts/:category/:slug", (req) => {
  const { category, slug } = req.params || {};
  return `Category: ${category}, Slug: ${slug}`;
});
```

## HTTP Request Extensions

### HttpRequest Class

Extends the native `Request` with additional properties:

```typescript
class HttpRequest extends Request {
  params?: Record<string, string | undefined>;
  query?: Record<string, string>;
  parseBody!: <T>() => Promise<T>;
}
```

#### Properties

- `params` - URL parameters from route patterns
- `query` - Query string parameters as an object

#### Methods

##### `parseBody<T>(): Promise<T>`

Parse request body as JSON.

```typescript
f.post("/users", async (req) => {
  const userData = await req.parseBody<{
    name: string;
    email: string;
  }>();

  return { message: `Hello ${userData.name}` };
});
```

## Context API

### Context Class

Provides request context and response utilities.

```typescript
class Context {
  info: Deno.ServeHandlerInfo;
  url: URL;
  server: Fastro;
  kv: Deno.Kv;
  options: Record<string, any>;
  stores: Map<string, Store<any, any>>;

  render<T>(data?: T, headers?: Headers): Response | Promise<Response>;
  send<T>(data?: T, status?: number, headers?: Headers): Response;
  next(): void;
}
```

#### Methods

##### `render<T>(data?: T, headers?: Headers): Response | Promise<Response>`

Render JSX components or page data.

```typescript
// Render JSX component
f.get("/hello", (_, ctx) => {
  return ctx.render(<h1>Hello World</h1>);
});

// Render page data (when used in page handlers)
f.page("/profile", {
  component: ProfilePage,
  layout: AppLayout,
  handler: (_, ctx) => {
    return ctx.render({ user: { name: "John" } });
  },
});
```

##### `send<T>(data?: T, status?: number, headers?: Headers): Response`

Send response data.

```typescript
f.get("/api/users", (_, ctx) => {
  return ctx.send([{ id: 1, name: "John" }], 200);
});

f.get("/error", (_, ctx) => {
  return ctx.send({ error: "Not found" }, 404);
});
```

##### `next(): void`

Call the next middleware in the chain.

```typescript
f.use((req, ctx) => {
  console.log(`Request: ${req.method} ${req.url}`);
  return ctx.next();
});
```

## Middleware

### Handler Type

```typescript
type Handler = (
  req: HttpRequest,
  ctx: Context,
) => string | object | number | boolean | undefined | Response | Promise<any>;
```

### Global Middleware

Applied to all routes:

```typescript
f.use((req, ctx) => {
  // Add timestamp to all requests
  req.timestamp = Date.now();
  return ctx.next();
});

f.use(async (req, ctx) => {
  // Authentication middleware
  const token = req.headers.get("Authorization");
  if (!token) {
    return ctx.send({ error: "Unauthorized" }, 401);
  }
  return ctx.next();
});
```

### Route-specific Middleware

Applied to specific routes:

```typescript
f.get(
  "/protected", // Middleware 1
  (req, ctx) => {
    if (!req.headers.get("Authorization")) {
      return ctx.send({ error: "Unauthorized" }, 401);
    }
    return ctx.next();
  }, // Middleware 2
  (req, ctx) => {
    req.user = { id: 1, name: "John" };
    return ctx.next();
  }, // Final handler
  (req, ctx) => {
    return ctx.send({ message: `Hello ${req.user.name}` });
  },
);
```

## Pages & SSR

### Page Definition

```typescript
type Page<T = any> = {
  component: FunctionComponent | JSX.Element;
  layout: Layout<T>;
  handler: Handler;
  script?: string;
  folder?: string;
};
```

### Creating Pages

```typescript
import { PageProps } from "@app/core/server/types.ts";

// Page component
function HomePage({ data }: PageProps<{ title: string }>) {
  return <h1>{data.title}</h1>;
}

// Layout component
function AppLayout({ children, data }: LayoutProps<any>) {
  return (
    <html>
      <head>
        <title>{data.title}</title>
      </head>
      <body>{children}</body>
    </html>
  );
}

// Register page
f.page("/", {
  component: HomePage,
  layout: AppLayout,
  handler: (_, ctx) => {
    return ctx.render({ title: "Welcome" });
  },
});
```

### Page Middleware

```typescript
f.page(
  "/dashboard",
  {
    component: Dashboard,
    layout: AppLayout,
    handler: (req, ctx) => {
      return ctx.render({ user: req.user });
    },
  }, // Page middleware
  (req, ctx) => {
    // Authentication check
    if (!req.user) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/login" },
      });
    }
    return ctx.next();
  },
);
```

### Client-side Hydration

Pages with function components automatically support client-side hydration:

```typescript
function Counter({ data }: PageProps<{ count: number }>) {
  const [count, setCount] = useState(data.count);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

## Store

### Store Class

Thread-safe, TTL-enabled key-value store with persistence.

```typescript
import { Store } from "@app/core/map/mod.ts";

const store = new Store<string, any>({
  key: "my-store",
  namespace: ["app", "cache"],
});
```

#### Constructor Options

```typescript
type StoreOptions = {
  key: string;
  namespace?: Array<string>;
} | null;
```

#### Methods

##### `set(key: K, value: V, ttl?: number): Store`

Set a value with optional TTL (time-to-live) in milliseconds.

```typescript
store.set("user:1", { name: "John" }, 60000); // Expires in 1 minute
store.set("config", { theme: "dark" }); // No expiration
```

##### `get(key: K): Promise<V | undefined>`

Get a value by key.

```typescript
const user = await store.get("user:1");
console.log(user); // { name: "John" } or undefined if expired
```

##### `has(key: K): Promise<boolean>`

Check if key exists and hasn't expired.

```typescript
const exists = await store.has("user:1");
```

##### `delete(key: K): boolean`

Delete a key.

```typescript
const deleted = store.delete("user:1");
```

##### `clear(): void`

Clear all entries.

```typescript
store.clear();
```

##### `size(): number`

Get the number of entries (excluding expired ones).

```typescript
const count = store.size();
```

##### `commit(): Promise<any>`

Manually save to persistent storage.

```typescript
await store.set("key", "value").commit();
```

##### `sync(interval?: number): number`

Auto-sync to persistent storage at intervals.

```typescript
const intervalId = store.sync(5000); // Sync every 5 seconds
clearInterval(intervalId); // Stop syncing
```

##### `destroy(): Store`

Clean up resources and clear data.

```typescript
store.destroy();
```

### Using Store in Handlers

```typescript
f.get("/cache/:key", async (req, ctx) => {
  const key = req.params?.key;
  const value = await ctx.stores.get("cache")?.get(key);

  if (!value) {
    return ctx.send({ error: "Not found" }, 404);
  }

  return ctx.send({ data: value });
});

f.post("/cache/:key", async (req, ctx) => {
  const key = req.params?.key;
  const { value, ttl } = await req.parseBody<{
    value: any;
    ttl?: number;
  }>();

  const store = ctx.stores.get("cache") || new Store({ key: "cache" });
  store.set(key, value, ttl);
  await store.commit();

  return ctx.send({ message: "Cached" });
});
```

## Utils

### Task Queue

Sequential task execution utility.

```typescript
import { createTaskQueue } from "@app/core/utils/queue.ts";

const queue = createTaskQueue();

// Process tasks sequentially
const result1 = await queue.process(() => "task 1");
const result2 = await queue.process(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return "task 2";
});
```

### Key-Value Database

Deno KV singleton instance.

```typescript
import { collectValues, kv, reset } from "@app/core/utils/kv.ts";

// Set value
await kv.set(["users", "123"], { name: "John" });

// Get value
const user = await kv.get(["users", "123"]);

// List values
const users = kv.list({ prefix: ["users"] });
const allUsers = await collectValues(users);

// Reset database (development only)
await reset();
```

## Build System

### EsbuildMod

Handles client-side JavaScript bundling for page components.

```typescript
import { EsbuildMod } from "@app/core/build/esbuildMod.ts";

const builder = new EsbuildMod(page);
const result = await builder.build();
```

### Build Configuration

The build system automatically:

- Bundles page components for client-side hydration
- Generates hydration scripts
- Minifies and optimizes JavaScript
- Handles TypeScript and JSX compilation

## Render Engine

### Render Class

Handles server-side rendering and client-side hydration.

```typescript
import { Render } from "@app/core/render/render.ts";

const render = new Render(server);
```

#### Methods

##### `renderJsx(jsx: JSX.Element, headers?: Headers): Response`

Render JSX to HTML response.

```typescript
const response = render.renderJsx(<h1>Hello</h1>);
```

##### `render<T>(key: string, page: Page, data: T, nonce: string, headers?: Headers): Promise<Response>`

Render a complete page with layout and hydration.

```typescript
const response = await render.render("/", page, { title: "Home" }, nonce);
```

## Environment Variables

### Development Mode

Set `ENV=DEVELOPMENT` to enable:

- Hot reload functionality
- Development-specific endpoints
- Unminified JavaScript output

### Build ID

- `DENO_DEPLOYMENT_ID` - Used for cache busting in production

### KV Database

- `DENO_KV_PATH` - Custom path for Deno KV database

## Error Handling

### Global Error Handling

```typescript
f.use((req, ctx) => {
  try {
    return ctx.next();
  } catch (error) {
    console.error("Error:", error);
    return ctx.send({ error: "Internal Server Error" }, 500);
  }
});
```

### Route-specific Error Handling

```typescript
f.get("/users/:id", async (req, ctx) => {
  try {
    const user = await getUserById(req.params?.id);
    return ctx.send(user);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return ctx.send({ error: "User not found" }, 404);
    }
    throw error;
  }
});
```

## Security

### Content Security Policy

Automatic CSP header for pages:

```typescript
"Content-Security-Policy": `script-src 'self' 'unsafe-inline' 'nonce-${nonce}' https: http: ; object-src 'none'; base-uri 'none';`
```

### Referer Checking

For static files with `referer: true`:

```typescript
f.static("/assets", { referer: true });
```

## Examples

### Basic API Server

```typescript
import fastro from "https://fastro.deno.dev/mod.ts";

const f = new fastro();

f.get("/api/health", (_, ctx) => {
  return ctx.send({ status: "healthy" });
});

f.post("/api/users", async (req, ctx) => {
  const user = await req.parseBody<{ name: string; email: string }>();
  // Save user...
  return ctx.send({ id: 1, ...user }, 201);
});

await f.serve({ port: 8000 });
```

### Full-stack Application

```typescript
import fastro from "https://fastro.deno.dev/mod.ts";

const f = new fastro();

// Static files
f.static("/public", { folder: "assets", maxAge: 86400 });

// API routes
f.get("/api/posts", (_, ctx) => {
  return ctx.send([{ id: 1, title: "Hello World" }]);
});

// Pages
f.page("/", {
  component: HomePage,
  layout: AppLayout,
  handler: (_, ctx) => {
    return ctx.render({ title: "Welcome" });
  },
});

f.page("/posts/:id", {
  component: PostPage,
  layout: AppLayout,
  handler: async (req, ctx) => {
    const post = await getPost(req.params?.id);
    return ctx.render({ post });
  },
});

await f.serve({ port: 8000 });
```
