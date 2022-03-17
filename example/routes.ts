import { fastro } from '../server/mod.ts'

const app = fastro()

app.get('/ab?cd', () => {
    return new Response("/ab?cd")
})

app.get('/ab+cd', () => {
    return new Response("/ab+cd")
})

app.get('/ab*cd', () => {
    return new Response("ab*cd")
})

app.get('/ab(cd)?e', () => {
    return new Response("ab(cd)?e")
})

app.get(/a/, () => {
    return new Response("/a/")
})

app.get(/.*fly$/, () => {
    return new Response("/.*fly$/")
})

await app.serve()