import application from "$fastro/server/mod.ts";

const app = application();

app.static("/", "./public");

await app.serve({ port: 8080 });
