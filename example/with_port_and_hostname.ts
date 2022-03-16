import { fastro } from '../server/mod.ts'

const app = fastro()

app.get('/', () => {
    return new Response("Hello world!")
})

await app.serve({ port: 3000 })