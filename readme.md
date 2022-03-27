# Fastro

Fast and simple web application framework for deno

## Basic usage

```ts
import { application } from "https://deno.land/x/application@v0.37.0/server/mod.ts";

await application()
  .get("/", () => new Response("Hello world"))
  .serve();

console.log("listening on: http://localhost:8000");
```

## Custom port

```ts
import { application } from "https://deno.land/x/application@v0.37.0/server/mod.ts";

const app = application();

app.get("/", () => new Response("Hello world!"));

await app.serve({ port: 3000 });
```

## Routing

```ts
import { application } from "https://deno.land/x/application@v0.37.0/server/mod.ts";

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
} from "https://deno.land/x/application@v0.37.0/server/mod.ts";

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

## Route Level Middleware

```ts
import {
  application,
  ConnInfo,
  Next,
} from "https://deno.land/x/application@v0.37.0/server/mod.ts";

const app = application();

app.get("/", (_req: Request, _conn: ConnInfo, next: Next) => {
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  next();
}, (_req: Request, _conn: ConnInfo) => {
  return new Response("Middleware");
});

console.log("listening on: http://localhost:8000");
await app.serve();
```
