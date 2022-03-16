# Fastro
Fast and simple deno web application framework

## Basic usage
```ts
import { fastro } from 'https://deno.land/x/fastro@v0.32.0/server/mod.ts'

const app = fastro()

app.get('/', () => {
    return new Response("Hello world!")
})

await app.serve()
```

## Custom port
```ts
import { fastro } from 'https://deno.land/x/fastro@v0.32.0/server/mod.ts'

const app = fastro()

app.get('/', () => {
    return new Response("Hello world!")
})

await app.serve({ port: 3000 })
```

## Middleware
```ts
import { fastro, ConnInfo, Next } from 'https://deno.land/x/fastro@v0.32.0/server/mod.ts'

const app = fastro()

function middleware(req: Request, connInfo: ConnInfo, next: Next) {
    console.log('url=', req.url)
    console.log('remoteAddr=', connInfo.remoteAddr)
    next()
}

function handler(_req: Request, _connInfo: ConnInfo) {
    return new Response("Hello world!")
}

app.get('/', middleware, handler)

await app.serve()
```

