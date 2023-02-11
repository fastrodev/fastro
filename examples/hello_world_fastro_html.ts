import application from "$fastro/server/mod.ts";

const app = application();

app.get("/", (_req, res) => res.status(200).html("<h1>Hello</h1>"));

await app.serve();
