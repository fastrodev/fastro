import application, { dependency } from "../server/mod.ts"
import { DB } from "https://deno.land/x/sqlite@v3.3.0/mod.ts"

const app = application()
const db = new DB("test.db")

const deps = dependency()
deps.set("hello", () => "Hello world")
deps.set("db", db)
app.use(deps)

app.get("/", () => {
  type FunctionType = () => string
  const fn = <FunctionType>app.getDeps("hello")
  return new Response(fn())
})

app.post("/name", () => {
  const db = <DB>app.getDeps("db")
  db.query(`CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT)`)

  const names = ["Peter Parker", "Clark Kent", "Bruce Wayne"]
  for (const name of names) {
    db.query("INSERT INTO people (name) VALUES (?)", [name])
  }

  return new Response(JSON.stringify(names))
})

app.get("/name", () => {
  const db = <DB>app.getDeps("db")
  const res = db.query("SELECT name FROM people")
  return new Response(JSON.stringify(res))
})

console.log("Listening on: http://localhost:8000")

await app.serve()
