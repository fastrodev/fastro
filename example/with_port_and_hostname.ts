import { fastro } from "../server/mod.ts"

const app = fastro({ port: 3000, hostname: '127.0.0.1' })

app.get('/', () => {
    return new Response("Hello world!")
})

await app.serve()