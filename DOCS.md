# 📖 Fastro Documentation

Fastro is a high-performance, minimalist web framework for Deno. This documentation covers the core components and how to use them effectively.

---

## 🚀 Getting Started

To create a basic server, import the default export from `mod.ts`.

```ts
import app from "./mod.ts";

app.get("/", () => "Hello Fastro!");

await app.serve({ port: 8000 });
```

---

## 🛣️ Routing

Fastro supports standard HTTP methods and dynamic path parameters.

### Basic Routes
```ts
app.get("/welcome", () => "Welcome!");
app.post("/submit", () => new Response("Created", { status: 201 }));
```

### Path Parameters
Parameters are defined using the `:name` syntax and are accessible via `ctx.params`.
```ts
app.get("/user/:id", (req, ctx) => {
  const id = ctx.params.id;
  return `User ID: ${id}`;
});
```

### Advanced Patterns
You can use `URLPattern` objects for complex matching.
```ts
const pattern = new URLPattern({ pathname: "/static/:file.png" });
app.get(pattern, (req, ctx) => {
  return `Streaming ${ctx.params.file}.png`;
});
```

---

## ⚡ Responses

Fastro is designed for low boilerplate. Handlers can return:
1.  **String**: Automatically sent as `text/plain`.
2.  **Object/Array**: Automatically sent as `application/json` via `Response.json()`.
3.  **Response**: The standard Deno/Web Response object.
4.  **Promise**: Any of the above wrapped in a Promise (async handlers).

```ts
app.get("/json", () => ({ status: "ok", code: 200 }));
app.get("/async", async () => {
  const data = await fetchData();
  return data;
});
```

---

## 🧩 Middleware

Middlewares follow the `(req, ctx, next)` pattern.

### Global Middleware
Applies to every request.
```ts
app.use((req, ctx, next) => {
  console.log(`${req.method} ${req.url}`);
  return next();
});
```

### Route-Level Middleware
Applies only to a specific route.
```ts
const auth = (req, ctx, next) => {
  if (req.headers.get("Authorization")) return next();
  return new Response("Unauthorized", { status: 401 });
};

app.get("/admin", auth, () => "Welcome Admin");
```

---

## 🏗️ Modular Routing (Router)

For larger applications, use `createRouter` to group routes.

```ts
import { createRouter } from "./mod.ts";

const api = createRouter()
  .get("/v1/ping", () => "pong")
  .get("/v1/status", () => ({ online: true }));

// Plug it into the main app
app.use(api.build());
```

---

## 📂 Automatic Module Loading

Fastro can automatically register middlewares/routers from the `modules/` directory.

### Directory Structure
```
project/
  main.ts
  modules/
    auth/
      mod.ts
    api/
      mod.ts
```

### Usage
```ts
import app from "./mod.ts";
import { autoRegisterModules } from "./mod.ts";

// Scans 'modules/' and calls app.use() for each mod.ts
await autoRegisterModules(app);

await app.serve();
```

**Loading Order:**
1. `index/mod.ts` (Always first)
2. Alphabetical folders
3. `profile/mod.ts` (Always last)

---

## 🛠️ Context (`ctx`)

The `Context` object provides helpers for each request:
- `ctx.params`: Object containing path parameters.
- `ctx.query`: Object containing URL search parameters.
- `ctx.url`: A lazy-loaded `URL` object of the current request.
- `ctx.remoteAddr`: The client's network address information.

---

## 🏎️ Performance Features

- **LRU Caching**: Fastro automatically caches route matches to bypass regex execution on repeat requests.
- **Fast Path**: Root GET requests (`/`) bypass most overhead for maximum throughput.
- **Zero Dependencies**: Built strictly on Deno primitives to minimize cold starts and memory usage.
