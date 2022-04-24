import application from "../server/mod.ts"

const app = application()

app.get("/", () => "Hello world")

console.log("Listening on: http://localhost:8000")

await app.serve()
