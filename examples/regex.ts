import { fastro } from '../server/mod.ts'

const app = fastro()

app.get('/ab?cd', () => new Response("/ab?cd"))

app.get('/ab+cd', () => new Response("/ab+cd"))

app.get('/ab*cd', () => new Response("ab*cd"))

app.get('/ab(cd)?e', () => new Response("ab(cd)?e"))

app.get(/a/, () => new Response("/a/"))

app.get(/.*fly$/, () => new Response("/.*fly$/"))

await app.serve()