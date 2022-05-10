import application, { response } from "../../server/mod.ts";
import rendering from "../../server/ssr.ts";
import App from "./app.tsx";

const component = rendering(<App />)
  .dir("./examples/ssr");

const app = application(component)
  .static("/static")
  .get("/", () => {
    return response(component).render({ title: "Hello world" });
  });

console.log("Listening on: http://localhost:8000");

await app.serve();
