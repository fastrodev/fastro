---
title: "Understanding Cookie Middleware in Fastro"
description: "How Fastro's cookie middleware works, usage patterns, and security best practices."
date: 2026-02-09
author: "Fastro Team"
tags: ["middleware"]
---

# Understanding Cookie Middleware in Fastro

Cookies are a fundamental primitive for maintaining state in web applications. Fastro includes a small but useful cookie middleware that parses incoming `Cookie` headers into `ctx.cookies` and provides a helper `ctx.setCookie()` to append `Set-Cookie` headers to responses.

This post explains how the middleware works, how to use it in your modules, and a few security best practices.

**Where to find the code**

- Middleware implementation: [middlewares/cookie/cookie.ts](/middlewares/cookie/cookie.ts)
- Re-export: [middlewares/cookie/mod.ts](/middlewares/cookie/mod.ts)
- Tests: [middlewares/cookie/cookie.test.ts](/middlewares/cookie/cookie.test.ts)

**What it provides**

- `ctx.cookies` — an object of parsed cookie name → value for the current request.
- `ctx.setCookie(name, value, opts?)` — add a `Set-Cookie` header (the middleware collects multiple cookies and appends them to the response).

Why this is useful: handlers can read cookies synchronously (`const user = ctx.cookies?.user`) and set cookies without manually formatting header strings.

Usage example

1) Register the middleware globally in `app/main.ts`:

```ts
import { cookieMiddleware } from "../middlewares/cookie/mod.ts";

app.use(cookieMiddleware);
```

2) Read cookie in a handler (e.g. `modules/dashboard/handler.tsx`):

```ts
const user = ctx.cookies?.user;
if (!user) return new Response(null, { status: 303, headers: { Location: "/signin" } });
```

3) Set cookie after successful signin (e.g. `modules/signin/handler.tsx`):

```ts
ctx.setCookie("user", identifier, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 });
return new Response(null, { status: 303, headers: { Location: "/dashboard" } });
```

Security best practices

- Prefer `HttpOnly` for session cookies so JavaScript in the browser cannot access the cookie.
- Use `Secure` when serving over HTTPS to prevent sending cookies over plain HTTP.
- Set `SameSite` to `Lax` or `Strict` to reduce CSRF surface.
- Avoid storing secrets or raw passwords in cookies. Store an opaque session id or signed token and validate server-side.

Testing

Unit tests for the middleware are located at [middlewares/cookie/cookie.test.ts](/middlewares/cookie/cookie.test.ts). They cover parsing and `Set-Cookie` handling behavior.

Further reading

- See the middleware source for formatting details: [middlewares/cookie/cookie.ts](/middlewares/cookie/cookie.ts)
- Middleware list (docs): [MIDDLEWARES.md](/MIDDLEWARES.md)

If you want, I can add a short example module that demonstrates a full signin → dashboard flow using the cookie middleware.
