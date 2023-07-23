---
title: "Manual"
description: This is documentation on how to use, build, and deploy the app.
image: https://fastro.dev/static/image.png
author: Fastro
date: 07/23/2023
---

Make sure you have Deno installed. See [the deno manual](https://deno.land/manual/getting_started/installation) for details.


## Your first end point

Create a folder for your project and enter to it.

```zsh
mkdir my-project && cd my-project
```

Create a `main.ts` file for deno-cli entry point.

```ts
import fastro from "https://deno.land/x/fastro/mod.ts";

const f = new fastro();

f.get("/", () => "Hello, World!");

await f.serve();
```

Run the app

```zsh
deno run -A main.ts
```

> You can change the method with: `f.post`, `f.put`, `f.delete`, `f.options`, and `f.head`.  
> 
> You can also return handlers of several types: `JSON`, `Array`, `Number`, `Boolean`, `Response` and `JSX` (Server Side Rendering).

## Deno standard handler signature

Fastro use [Deno standard library](https://deno.land/std), so you can also add [`Request`](https://deno.com/deploy/docs/runtime-request) and [ConnInfo](https://deno.land/std/http/mod.ts?s=ConnInfo) params for the handler. 

This code is used to get client IP address:

```ts
import { ConnInfo } from "https://deno.land/std/http/server.ts";
import fastro from "https://deno.land/x/fastro/mod.ts";

const f = new fastro();

f.get("/", (_req: Request, info: ConnInfo) => {
  const addr = connInfo.remoteAddr as Deno.NetAddr;
  const ip = addr.hostname;
  return new Response(`Your IP address is <b>${ip}</b>`, {
    headers: { "content-type": "text/html" },
  });
});

await f.serve();

```

## Fastro handler signature

Fastro extends `Request` and `ConnInfo` to add functionality.

- `Request` become [`HttpRequest`](https://deno.land/x/fastro/mod.ts?s=HttpRequest).
- `ConnInfo` become [`Context`](https://deno.land/x/fastro/mod.ts?s=Context).


### Text

This code will send response `Hello world` text with the http status.

```ts
import fastro, { Context, HttpRequest } from "https://deno.land/x/fastro/mod.ts";

const f = new fastro();

f.get(
  "/",
  (_req: HttpRequest, ctx: Context) => {
    return ctx.send("Helo world", 200);
  },
);

await f.serve();

```

> You can also send several types of document: `JSON`, `Array`, `Number`, `Boolean`, and `JSX` (Server Side Rendering).

### URL Params and Query

This code will get url params and query from url `http://localhost:8000/agus?title=lead` and then send JSON response with http status.

```ts
import fastro, { HttpRequest } from "https://deno.land/x/fastro/mod.ts";

const f = new fastro();

f.get("/:user", (req: HttpRequest, ctx: Context) => {
  const data = { user: req.params?.user, name: req.query?.name };
  return ctx.send(data, 200);
});

await f.serve();

```

### Middleware

You can access `HttpRequest` and `Context` and process them before the handler you define.

```ts
type MiddlewareArgument = (request: HttpRequest, ctx: Context, next: Next) => Promise<unknown> | unknown
```

There are two types middleware:
- App level middleware
- Route level middleware

### App level middleware

This type of middleware will run on all routes.

The code below will: 
- return `You are not authorized` text if the url is `/admin`.
- go to the `next` handler (return `Hello world`)

```ts
import fastro from "https://deno.land/x/fastro/mod.ts";

const f = new fastro();

// app middleware
f.use((req: HttpRequest, ctx: Context, next: Next) => {
  if (req.url === "/admin") {
    return ctx.send("You are not authorized");
  }

  console.log(`%c${req.method} %c${req.url}`, "color: blue", "color: green");
  return next();
});

// handler
f.get(
  "/",
  (_req: HttpRequest, ctx: Context) => {
    return ctx.send("Helo world", 200);
  },
);

await f.serve();
```

### Route level middleware

This type of middleware only executed for specific route.

```ts
import fastro from "https://deno.land/x/fastro/mod.ts";

const f = new fastro();

f.get(
  // path
  "/",
  // route middleware
  (_req: HttpRequest, _ctx: Context, next: Next) => {
    console.log(`%c${req.method} %c${req.url}`, "color: blue", "color: green");
    return next();
  },
  // handler
  (_req: HttpRequest, ctx: Context) => {
    return ctx.send("Helo world", 200);
  },
);

await f.serve();
```

You can also add multiple middleware in one route.

```ts
f.get(
  // path
  "/your-path",
  // route middleware #1
  (_req: HttpRequest, _ctx: Context, next: Next) => {
    // middleware implementation
    return next();
  },
  // route middleware #2
  (_req: HttpRequest, _ctx: Context, next: Next) => {
    // middleware implementation
    return next();
  },
   // route middleware #3
  (_req: HttpRequest, _ctx: Context, next: Next) => {
    // middleware implementation
    return next();
  },
  // handler
  (_req: HttpRequest, ctx: Context) => {
    return ctx.send("Helo world", 200);
  },
);
```

### Static file

You can setup static file with `static` function.

It has two arguments:
- `path` for example: `/static`
- `options` for example: `{ folder: "static", maxAge: 90 }`

```ts
import fastro from "https://deno.land/x/fastro/mod.ts";

const f = new fastro();

f.static("/static", { folder: "static", maxAge: 90 });

await f.serve();

```

### Markdown

You can render `markdown` files using [middleware](https://deno.land/x/fastro/middlewares/markdown.tsx).

The constructor has optional `options` consisting of:
- `header`: `FunctionComponent`.
- `footer`: `FunctionComponent`.
- `folder`: `string`.
- `options`: `RenderOptions`.

Just put your markdown to your child of your root project, and access them without file extension.

```ts
import fastro from "https://deno.land/x/fastro/mod.ts";
import markdown from "https://deno.land/x/fastro/middlewares/markdown.tsx";

const f = new fastro();
const m = new markdown({ folder: "docs" });

f.use(m.middleware);
f.static("/static", { folder: "static", maxAge: 90 });

await f.serve();

```

### Server Side Rendering

You can create SSR endpoint by using `f.page`.

It has 3 arguments:
- `path`: `string`
- `Component`: `JSX.Element` or `FunctionComponent`
- `Handler`: `HandlerArgument`

> - If you use `JSX.Element`, server will only render the element into HTML with no JS file. 
> - If you use `FunctionComponent`, create hydration file and render `FunctionComponent` together with bundled file from hydration process.

```ts
import fastro, { Context, HttpRequest } from "https://deno.land/x/fastro/mod.ts";
import user from "../pages/user.tsx";

const f = new fastro();

f.static("/static", { folder: "static", maxAge: 90 });
f.page(
  // path
  "/",
  // react component
  user,
  // handler
  (_req: HttpRequest, ctx: Context) => {
    const options = {
      props: { data: "Guest" },
      status: 200,
      html: { head: { title: "React Component" } },
    };
    return ctx.render(options);
  },
);

await f.serve();

```

This is the `user.tsx` page.

```tsx
import React from "https://esm.sh/react@18.2.0";

const User = (props: { data: string }) => (
  <h1>Hello {props.data}</h1>
);

export default User;

```

You can also add route middleware to `f.page` before actual handler.

```ts
f.page(
  // path
  "/",
  // react component
  user,
  // middleware #1
  (_req: HttpRequest, _ctx: Context, next: Next) => {
    // middleware implementation
    return next();
  },
   // middleware #2
  (_req: HttpRequest, _ctx: Context, next: Next) => {
    // middleware implementation
    return next();
  },
  // handler
  (_req: HttpRequest, ctx: Context) => {
    const options = {
      props: { data: "Guest" },
      status: 200,
      html: { head: { title: "React Component" } },
    };
    return ctx.render(options);
  },
);

```