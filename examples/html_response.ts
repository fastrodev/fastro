import application from "../server/mod.ts"

const app = application()

app.get("/", () => {
    return new Response("<html> Hello world </html>", {
        status: 200,
        headers: {
            "content-type": "text/html",
        },
    })
})

console.log("Listening on: http://localhost:8000")

await app.serve()