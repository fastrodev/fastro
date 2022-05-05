import application, { response, Cookie, getCookies } from "../server/mod.ts"

const app = application()

app.get("/set", () => {
    const cookie: Cookie = { name: "Space", value: "Cat" }
    return response()
        .setCookie(cookie)
        .send(JSON.stringify(cookie))
})

app.get("/delete", () => {
    return response()
        .deleteCookie("Space")
        .send("Cookie deleted")
})

app.get("/check", (req: Request) => {
    const cookie = getCookies(req.headers)
    return response().send(JSON.stringify(cookie))
})

console.log("Listening on: http://localhost:8000")

await app.serve()
