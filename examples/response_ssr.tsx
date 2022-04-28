import application, { response } from "../server/mod.ts"
import App from "./response_ssrApp.tsx"

const app = application()
const hydratePath = "./examples/response_ssrClient.tsx"

app.get("/", () => {
    const res = response()
    return res.ssr(<App />, hydratePath)
})

console.log("Listening on: http://localhost:8000")

await app.serve()