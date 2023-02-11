import application from "../server/mod.ts";

const app = application();

app.get("/", (_req, res) => res.status(200).send("Hello fastro"));

await app.serve();
