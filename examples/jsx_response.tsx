import application from "../server/mod.ts"

const app = application()

app.get("/", () => <h1>Hello world</h1>)

console.log("Listening on: http://localhost:8000")

await app.serve()