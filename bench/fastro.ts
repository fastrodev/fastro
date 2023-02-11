import application from "../server/mod.ts";

const app = application();

app.get("/", () => "Hello, Bench!");

await app.serve({ port: 8000 });
