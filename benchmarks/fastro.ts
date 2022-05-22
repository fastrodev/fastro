import application from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";
const app = application();
app.get("/", () => "Hello, World!");
console.log("Listening on: http://localhost:8000");
await app.serve();
