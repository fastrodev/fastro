import application from "../server/mod.ts";

const app = application();

app.get("/", () => ({ text: "Hello json" }));

await app.serve();
