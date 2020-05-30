import { Fastro, Request } from "../mod.ts";

const router = (server: Fastro, request: Request) => {
  server.get('/ok', (req) => {
    req.send('hello')
  })
}


const server = new Fastro();

server
  .register(router)
  .get('/', (req) => {
    req.send('hello')
  })

await server.listen()