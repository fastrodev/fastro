import { application } from "https://deno.land/x/fastro@v0.38.0/server/mod.ts";

const app = application();

app.get("/", () => new Response("Hello world"));

console.log("Listening on: http://localhost:8000");

await app.serve();
