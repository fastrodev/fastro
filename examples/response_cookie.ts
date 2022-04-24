import application, { response, Cookie, getCookies } from "../server/mod.ts"

const app = application()

app.get("/set", () => {
    const res = response()
    const cookie: Cookie = { name: "Space", value: "Cat" }

    return res.setCookie(cookie)
        .send(JSON.stringify(cookie))
})

app.get("/del", () => {
    const res = response()
    return res.deleteCookie("Space").send("Cookie deleted")
})

app.get("/chk", (req: Request) => {
    const res = response()
    const cookie = getCookies(req.headers)
    return res.send(JSON.stringify(cookie))
})

console.log("Listening on: http://localhost:8000")

await app.serve()
