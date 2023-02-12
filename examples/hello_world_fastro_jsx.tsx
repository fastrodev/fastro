import application from "../server/mod.ts";

const app = application();

app.get("/", (_req, res) => res.status(200).jsx(<h1>Hello, jsx</h1>));

await app.serve();
