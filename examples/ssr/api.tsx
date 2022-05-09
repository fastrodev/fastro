import application, { response } from "../../server/mod.ts";
import rendering from "../../server/ssr.ts";
import App from "./app.tsx";

const ssr = rendering()
  .dir("./examples/ssr")
  .component(<App />);

const app = application(ssr)
  .static("/static")
  .get("/", () => {
    return response(ssr).render({ title: "Hello world" });
  });

console.log("Listening on: http://localhost:8000");

await app.serve();
