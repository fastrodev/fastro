import application from "$fastro/server/mod.ts";

const app = application();

app.get("/", () => <h1>Hello jsx</h1>);

await app.serve();
