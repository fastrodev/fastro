# Fastro

Fast and simple web application framework for deno

## Basic usage

```ts
import { fastro } from "https://deno.land/x/fastro@v0.36.0/server/mod.ts";

const app = fastro();

app.get("/", () => new Response("Hello world!"));

await app.serve();
```

## Custom port

```ts
import { fastro } from "https://deno.land/x/fastro@v0.36.0/server/mod.ts";

const app = fastro();

app.get("/", () => new Response("Hello world!"));

await app.serve({ port: 3000 });
```

## Middleware

```ts
import {
  ConnInfo,
  fastro,
  Next,
} from "https://deno.land/x/fastro@v0.36.0/server/mod.ts";

const app = fastro();

function middleware(req: Request, connInfo: ConnInfo, next: Next) {
  console.log("url=", req.url);
  console.log("remoteAddr=", connInfo.remoteAddr);
  next();
}

app.get("/", middleware, () => new Response("Hello world!"));

await app.serve();
```

## Routing

```ts
import { fastro } from "https://deno.land/x/fastro@v0.36.0/server/mod.ts";

const app = fastro();

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
  fastro,
  getParam,
  getParams,
} from "https://deno.land/x/fastro@v0.36.0/server/mod.ts";

const app = fastro();

app.get("/:id/user/:name", (req: Request) => {
  const params = getParams(req);
  return new Response(JSON.stringify({ params }));
});

app.get("/post/:id", (req: Request) => {
  const param = getParam("id", req);
  return new Response(JSON.stringify({ param }));
});

await app.serve();
```
