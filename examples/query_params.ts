import application, { getQueries, getQuery } from "../server/mod.ts";

const app = application();

app.get("/hello", (req: Request) => {
  return getQueries(req);
});

app.get("/welcome", (req: Request) => {
  return getQuery(req, "name");
});

console.log("Listening on: http://localhost:8000");

await app.serve();
