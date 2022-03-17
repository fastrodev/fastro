import { fastro } from '../server/mod.ts'

const app = fastro()

app.get('/:id/user/:name', () => {
    return new Response("/:id/user/:name")
})

await app.serve()