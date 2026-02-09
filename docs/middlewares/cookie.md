# Cookie Middleware

This page documents Fastro's cookie middleware and how to use it in your application.

## What it does

- Parses the incoming `Cookie` header and exposes the values as `ctx.cookies`.
- Collects `Set-Cookie` values when `ctx.setCookie()` is called and appends them to the final response.

## Installation

Register it globally in your `app/main.ts` before modules are loaded:

```ts
import { cookieMiddleware } from "../middlewares/cookie/mod.ts";

app.use(cookieMiddleware);
```

## API

- `ctx.cookies`: Record<string, string> — parsed cookies for the request.
- `ctx.setCookie(name: string, value: string, opts?: CookieOptions)`: void — schedule a `Set-Cookie` header.

See the middleware source for the `CookieOptions` type and formatting rules: [middlewares/cookie/cookie.ts](../../middlewares/cookie/cookie.ts)

## Examples

- Read a cookie in a handler:

```ts
const user = ctx.cookies?.user;
```

- Set a session cookie after signin:

```ts
ctx.setCookie("user", identifier, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 });
```

## Security notes

Always use `HttpOnly`, `Secure`, and an appropriate `SameSite` policy for session cookies in production. Do not store plaintext secrets in cookies.

## Related files

- [middlewares/cookie/cookie.ts](../../middlewares/cookie/cookie.ts)
- [middlewares/cookie/cookie.test.ts](../../middlewares/cookie/cookie.test.ts)
