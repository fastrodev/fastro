import { fastro, ConnInfo, Next } from 'https://deno.land/x/fastro@v0.31.0/server/mod.ts'

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