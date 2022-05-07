import application, { response } from "../../server/mod.ts";
import render from "../../server/ssr.ts";
import App from "./app.tsx";

const app = application();
const ssr = render()
  .component(<App />)
  .title("Hello world")
  .hydrate("./examples/ssr/hydrate.tsx");

app.get("/", () => {
  return response(ssr).render();
});

console.log("Listening on: http://localhost:8000");

await app.serve();
