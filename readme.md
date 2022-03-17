# Fastro

Fast and simple web application framework for deno

## Basic usage

```ts
import { fastro } from 'https://deno.land/x/fastro@v0.33.1/server/mod.ts'

const app = fastro()

app.get('/', () => new Response('Hello world!'))

await app.serve()
```

## Custom port

```ts
import { fastro } from 'https://deno.land/x/fastro@v0.33.1/server/mod.ts'

const app = fastro();

app.get('/', () => new Response('Hello world!'))

await app.serve({ port: 3000 });
```

## Route parameters

```ts
import {
  fastro,
  getParam,
  getParams,
} from 'https://deno.land/x/fastro@v0.33.1/server/mod.ts'

const app = fastro();

app.get('/:id/user/:name', (req: Request) => {
  const params = getParams(req);
  const param = getParam('id', req);
  return new Response(JSON.stringify({
    params,
    param,
  }));
});

await app.serve();
```

## Middleware

```ts
import {
  ConnInfo,
  fastro,
  Next,
} from 'https://deno.land/x/fastro@v0.33.1/server/mod.ts'

const app = fastro()

function middleware(req: Request, connInfo: ConnInfo, next: Next) {
    console.log('url=', req.url)
    console.log('remoteAddr=', connInfo.remoteAddr)
    next()
}

app.get('/', middleware, () => new Response('Hello world!'))

await app.serve()
```
