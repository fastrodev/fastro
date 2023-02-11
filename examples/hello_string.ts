import application from "$fastro/server/mod.ts";

const app = application();

app.get("/", () => "Hello string");

await app.serve();
