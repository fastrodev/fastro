import application from "https://fastro.dev/server/mod.ts";

const app = application();

app.get("/", () => new Response("Hello world!"));

await app.serve({ port: 3000 });
