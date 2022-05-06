import application, { response } from "../../server/mod.ts"
import App from "./app.tsx"

const app = application()
const hydratePath = "./examples/ssr/hydrate.tsx"

app.get("/", () => {
    return response().ssr(<App />, hydratePath)
})

console.log("Listening on: http://localhost:8000")

await app.serve()