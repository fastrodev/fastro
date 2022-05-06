import application from "../server/mod.ts"

const app = application()

app.get("/", () => {
    return { text: "Hello world" }
})

console.log("Listening on: http://localhost:8000")

await app.serve()