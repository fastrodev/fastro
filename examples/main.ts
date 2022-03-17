import { fastro } from '../server/mod.ts'

const app = fastro()

app.get('/', () => new Response("Hello world!"))

await app.serve()