import application from "../server/mod.ts";

const app = application();

const json = { text: "Hello world" };

app.get("/", () => json);

console.log("Listening on: http://localhost:8000");

await app.serve();
