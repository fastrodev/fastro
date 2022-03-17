import { fastro } from '../server/mod.ts'

await fastro().get('/', () => new Response("Hello world!")).serve()