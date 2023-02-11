import application from "$fastro/server/mod.ts";

const app = application();

app.get("/", () => ({ text: "Hello json" }));

await app.serve();
