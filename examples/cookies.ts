import {
  Cookie,
  deleteCookie,
  getCookies,
  setCookie,
} from "https://deno.land/std@0.133.0/http/cookie.ts"
import application from "../server/mod.ts"

const app = application()

app.get("/set", () => {
  const headers = new Headers()
  const cookie: Cookie = { name: "Space", value: "Cat" }
  setCookie(headers, cookie)

  return new Response(JSON.stringify(cookie), {
    headers
  })
})

app.get("/delete", () => {
  const headers = new Headers()
  deleteCookie(headers, "Space")
  const cookies = getCookies(headers)

  return new Response(JSON.stringify(cookies), {
    headers,
  })
})

app.get("/check", (req: Request) => {
  const cookie = getCookies(req.headers)
  return new Response(JSON.stringify(cookie))
})

console.log("Listening on: http://localhost:8000")

await app.serve()
