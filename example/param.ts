import { fastro } from '../server/mod.ts'

const app = fastro()

app.get('/id/:name', () => {
    return new Response("Hello world!")
})

await app.serve()