import application, { response } from "../server/mod.ts"

const app = application()

app.get("/", () => {
    return response()
        .contentType("application/json")
        .send(JSON.stringify({ msg: "Hello world" }))
})

console.log("Listening on: http://localhost:8000")

await app.serve()
