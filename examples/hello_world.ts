import application from "$fastro/server/mod.ts";

const app = application();

app.get("/", () => new Response("Hello world"));

await app.serve();
