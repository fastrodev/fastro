# Fastro

Fast and simple web application framework for deno

- [Getting started](#getting-started)
- [Basic usage](#basic-usage)
- [Custom port](#custom-port)
- [Routing](#routing)
- [Route Parameters](#route-parameters)
- [Router Middleware](#router-middleware)
- [Router Middleware with Array](#route-level-middleware-with-array)
- [Application Level Middleware](#application-level-middleware)
- [Application Level Middleware with Array](#application-level-middleware-with-array)
- [Route Level Middleware](#route-level-middleware)
- [Route Level Middleware with Array](#route-level-middleware-with-array)
- [Benchmarks](/benchmarks/readme.md)

## Getting started

```
deno run -A https://raw.githubusercontent.com/fastrodev/fastro/main/examples/main.ts
```

## Basic usage

```ts
import { application } from "https://fastro.dev/server/mod.ts";

const app = application();

app.get("/", () => new Response("Hello world"));

console.log("Listening on: http://localhost:8000");

await app.serve();
```

## Custom port

```ts
import { application } from "https://fastro.dev/server/mod.ts";

const app = application();

app.get("/", () => new Response("Hello world!"));

await app.serve({ port: 3000 });
```

## Routing

```ts
import { application } from "https://fastro.dev/server/mod.ts";

const app = application();

app.get("/abcd", () => new Response("/abcd"));

app.get("/ef?gh", () => new Response("/ef?gh"));

app.get("/ij+kl", () => new Response("/ij+kl"));

app.get("/mn*op", () => new Response("mn*op"));

app.get("/qr(st)?u", () => new Response("qr(st)?u"));

app.get(/v/, () => new Response("/v/"));

app.get(/.*fast$/, () => new Response("/.*fast$/"));

await app.serve();
```

## Route parameters

```ts
import {
  application,
  getParam,
  getParams,
} from "https://fastro.dev/server/mod.ts";

const app = application();

app.get("/:id/user/:name", (req: Request) => {
  const params = getParams(req);
  return new Response(JSON.stringify({ params }));
});

app.get("/post/:id", (req: Request) => {
  const param = getParam("id", req);
  return new Response(param);
});

await app.serve();
```

## Router Middleware

```ts
import {
  application,
  ConnInfo,
  Next,
  router,
} from "https://fastro.dev/server/mod.ts";

const app = application();
const r = router();
const middleware = (_req: Request, _connInfo: ConnInfo, next: Next) => {
  console.log("v2");
  next();
};

r.get("/", () => new Response("Get"))
  .post("/", () => new Response("Post"))
  .put("/", () => new Response("Put"))
  .delete("/", () => new Response("Delete"));

app.use("/v1", r);
app.use("/v2", middleware, r);

await app.serve();
```

## Router Middleware with Array

```ts
import {
  application,
  ConnInfo,
  Next,
  router,
} from "https://fastro.dev/server/mod.ts";

const app = application();
const r = router();
const middlewares = [(_req: Request, _connInfo: ConnInfo, next: Next) => {
  console.log("v2 - 1");
  next();
}, (_req: Request, _connInfo: ConnInfo, next: Next) => {
  console.log("v2 - 2");
  next();
}];

r.get("/", () => new Response("Get"))
  .post("/", () => new Response("Post"))
  .put("/", () => new Response("Put"))
  .delete("/", () => new Response("Delete"));

app.use("/v1", r);
app.use("/v2", middlewares, r);

await app.serve();
```

## Application Level Middleware

```ts
import { application, ConnInfo, Next } from "https://fastro.dev/server/mod.ts";

const app = application();

app.use((_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("app middleware #1");
  next();
});

app.use((_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("app middleware #2");
  next();
});

app.use((_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("app middleware #3");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("app middleware #4");
  next();
});

app.get("/", () => new Response("App level #1"));

await app.serve();
```

## Application Level Middleware with Array

```ts
import { application, ConnInfo, Next } from "https://fastro.dev/server/mod.ts";

const app = application();

const middlewares = [(_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #1");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #2");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #3");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #4");
  next();
}];

app.use(middlewares);

app.get("/", () => new Response("App level #1"));

await app.serve();
```

## Route Level Middleware

```ts
import { application, ConnInfo, Next } from "https://fastro.dev/server/mod.ts";

const app = application();

app.get("/efgh", (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #1");
  next();
}, () => new Response("Route level middleware #1"));

app.get("/ijkl", (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #1");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #2");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #3");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #4");
  next();
}, () => new Response("Route level middleware #2"));

await app.serve();
```

## Route Level Middleware with Array

```ts
import { application, ConnInfo, Next } from "https://fastro.dev/server/mod.ts";

const app = application();

const middlewares = [(_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #1");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #2");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #3");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #4");
  next();
}];

app.get("/mnop", middlewares, () => new Response("Route level middleware #3"));

await app.serve();
```
