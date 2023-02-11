import application from "$fastro/server/mod.ts";

const app = application();

app.get("/", (_req, res) => res.status(200).json({ status: true }));

await app.serve();
