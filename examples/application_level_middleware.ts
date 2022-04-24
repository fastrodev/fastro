import application, { ConnInfo, Next } from "../server/mod.ts"

const app = application()

app.use((_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("app middleware #1")
  next()
})

app.use((_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("app middleware #2")
  next()
})

app.use((_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("app middleware #3")
  next()
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("app middleware #4")
  next()
})

app.get("/", () => new Response("App level #1"))

await app.serve()
