import application, { response } from "../../server/mod.ts";
import { render } from "../../server/render.ts";
import App from "./app.tsx";

const app = application();
const hydratePath = "./examples/ssr/hydrate.tsx";

app.get("/", () => {
  const ssr = render()
    .element(<App />)
    .title("Hello world")
    .hydrate("./examples/ssr/hydrate.tsx");
  return response(ssr).ssr();
});

console.log("Listening on: http://localhost:8000");

await app.serve();
