import application, { response } from "../server/mod.ts"

const app = application()

app.get("/", () => response().html("<h2>Hello world</h2"))

console.log("Listening on: http://localhost:8000")

await app.serve()
