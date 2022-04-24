import application, { response } from "../server/mod.ts"

const app = application()

app.get("/", () => {
    const res = response()
    return res.status(200).send("status")
})

console.log("Listening on: http://localhost:8000")

await app.serve()
