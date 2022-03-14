import { fastro } from 'https://deno.land/x/fastro@v0.31.0/server/mod.ts'

const app = fastro()

app.get('/', () => {
    return new Response("Hello world!")
})

await app.serve()