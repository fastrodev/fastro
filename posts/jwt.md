---
title: "JWT Authentication Middleware in Fastro"
description: "Learn how to secure your Fastro applications using JSON Web Tokens (JWT) with zero external dependencies."
date: 2026-02-04
author: "Fastro Team"
tags: ["middleware", "tutorial"]
---

Security is a top priority for any web application. Fastro now includes a built-in JWT (JSON Web Token) middleware that allows you to secure your routes using the Web Crypto API, ensuring high performance and zero external dependencies.

## Why JWT?

JSON Web Tokens are a compact, URL-safe means of representing claims to be transferred between two parties. They are commonly used for authentication because they allow you to verify the identity of a user without needing to store session state on the server.

## Installation

The JWT middleware is part of the official Fastro middleware collection. You can import it directly from the `middlewares` directory.

```ts
import { jwt } from "https://deno.land/x/fastro/middlewares/jwt/mod.ts";
```

## Usage

To secure your routes, you simply need to provide a secret key to the `jwt` middleware.

### Basic Setup

```ts
import Fastro from "https://deno.land/x/fastro/mod.ts";
import { jwt } from "https://deno.land/x/fastro/middlewares/jwt/mod.ts";

const app = new Fastro();
const SECRET = "your-very-secure-secret";

// Protect all routes
app.use(jwt({ secret: SECRET }));

app.get("/", (req, ctx) => {
  // Decoded payload is accessible via ctx.state.user
  return { message: "Authenticated!", user: ctx.state.user };
});

await app.serve();
```

### Creating Tokens

Fastro also provides utility functions to create and verify tokens manually.

```ts
import { createToken } from "https://deno.land/x/fastro/middlewares/jwt/mod.ts";

const token = await createToken({ id: 123, role: "admin" }, SECRET);
console.log(token);
```

### Token Expiration

The middleware automatically respects the `exp` (expiration) field in the JWT payload.

```ts
// Create a token that expires in 1 hour
const exp = Math.floor(Date.now() / 1000) + (60 * 60);
const token = await createToken({ sub: "user123", exp }, SECRET);
```

## How it Works

The middleware:
1. Extracts the `Bearer` token from the `Authorization` header.
2. Verifies the signature using HMAC SHA-256 via the Web Crypto API.
3. Checks if the token has expired (if the `exp` claim is present).
4. Decodes the payload and attaches it to `ctx.state.user`.
5. Returns a `401 Unauthorized` response if any step fails.

## Zero Dependency

True to Fastro's philosophy, the JWT middleware uses only Deno built-ins and the standard Web Crypto API. This means:
- No external npm packages to audit.
- Smaller bundle size.
- Better performance and security.

---

Check out the [Middlewares list](/MIDDLEWARES.md) to explore more official Fastro middlewares!
