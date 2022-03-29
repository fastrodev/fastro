# Fastro

Fast and simple web application framework for deno

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

## Application Level Array Middleware

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

## Route Level Array Middleware

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
