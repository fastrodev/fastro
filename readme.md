# Fastro
Fast and simple deno web application framework

## Basic usage
```ts
import { fastro } from 'https://deno.land/x/fastro@v0.31.2/server/mod.ts'

const app = fastro()

app.get('/', () => {
    return new Response("Hello world!")
})

await app.serve()
```

## Custom port and hostname
```ts
import { fastro } from 'https://deno.land/x/fastro@v0.31.2/server/mod.ts'

const app = fastro({ port: 3000, hostname: '127.0.0.1' })

app.get('/', () => {
    return new Response("Hello world!")
})

await app.serve()
```

## Middleware
```ts
import { fastro, ConnInfo, Next } from 'https://deno.land/x/fastro@v0.31.2/server/mod.ts'

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

