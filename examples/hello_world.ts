import application from "../server/mod.ts";

const app = application();

// use std Request
app.get("/", (_req: Request) => new Response("Hello world"));

await app.serve();
