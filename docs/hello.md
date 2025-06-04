---
title: "Basic Request Handling"
description: Create your first Fastro application with a simple "Hello, World!" route and learn the fundamentals of building web applications with Fastro.
image: https://fastro.deno.dev/fastro.png
previous: structure
next: hello-context
---

This guide walks you through creating your first Fastro application. You'll
build a simple web server that responds with "Hello, World!" and learn the core
concepts along the way.

## Table of Contents

## Quick Start

Here's the complete code for your first Fastro application:

```ts
import fastro from "https://fastro.deno.dev/mod.ts";

// Create a new Fastro instance
const f = new fastro();

// Define a GET route that returns a greeting
f.get("/", () => "Hello, World!");

// Start the server on port 8000
await f.serve();
```

## Step-by-Step Breakdown

Let's build this application step by step:

### 1. Import Fastro

```ts
import fastro from "https://fastro.deno.dev/mod.ts";
```

This imports the Fastro framework directly from the CDN. No package manager
needed!

### 2. Create an Application Instance

```ts
const f = new fastro();
```

This creates a new Fastro application instance that will handle your routes and
server configuration.

### 3. Define Your First Route

```ts
f.get("/", () => "Hello, World!");
```

This creates a GET route for the root path (`/`). When someone visits your
website, they'll see "Hello, World!".

### 4. Start the Server

```ts
await f.serve();
```

This starts the HTTP server. By default, it listens on port 8000.

## Running the Application

1. **Save the code** to a file named `app.ts`

2. **Run with Deno**:
   ```bash
   deno run --allow-net app.ts
   ```

   > **Note**: The `--allow-net` flag is required to allow network access.

3. **Open your browser** and navigate to `http://localhost:8000`

You should see "Hello, World!" displayed in your browser! 🎉

## Understanding the Code

| Component         | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `import fastro`   | Loads the Fastro framework               |
| `new fastro()`    | Creates an application instance          |
| `f.get("/", ...)` | Defines a route handler for GET requests |
| `await f.serve()` | Starts the HTTP server                   |

## Testing Your Server

You can test your server using different methods:

**Using curl:**

```bash
curl http://localhost:8000
# Output: Hello, World!
```

**Using browser developer tools:**

- Open Network tab
- Navigate to `http://localhost:8000`
- Check the response

## Common Issues

### Permission Denied

If you see a permission error, make sure you're using the `--allow-net` flag:

```bash
deno run --allow-net app.ts
```

### Port Already in Use

If port 8000 is busy, specify a different port:

```ts
await f.serve({ port: 3000 });
```

### Import Error

Ensure you have an internet connection to download the Fastro module from the
CDN.

## Next Steps

Congratulations! You've created your first Fastro application. Here's what to
explore next:

- **[Request Context](hello-context)** - Learn to handle request data and
  parameters
- **[Routing](routing)** - Discover advanced routing patterns
- **[Middleware](middleware)** - Add functionality with middleware
- **[Templates](templates)** - Render dynamic HTML responses

## Quick Reference

```ts
// Different response types
f.get("/text", () => "Plain text");
f.get("/json", () => ({ message: "JSON response" }));
f.get("/html", () => "<h1>HTML response</h1>");

// Custom port
await f.serve({ port: 3000 });

// Custom hostname
await f.serve({ hostname: "0.0.0.0", port: 8000 });
```

Ready to build something more complex? Continue to
[Request Context](hello-context) to learn about handling user input and dynamic
responses.
