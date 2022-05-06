import application from "../server/mod.ts"

const app = application()

app.get("/", () => {
    const json = { text: "Hello world" }
    return new Response(JSON.stringify(json), {
        status: 200,
        headers: {
            "content-type": "application/json",
        },
    })
})

console.log("Listening on: http://localhost:8000")

await app.serve()