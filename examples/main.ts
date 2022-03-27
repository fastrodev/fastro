import { application } from "../server/mod.ts";

await application()
  .get("/", () => new Response("Hello world"))
  .serve();

console.log("listening on: http://localhost:8000");
