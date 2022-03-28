import { application } from "../server/mod.ts";

console.log("Listening on: http://localhost:8000");

await application()
  .get("/", () => new Response("Hello world"))
  .serve();
