import application, { Deps } from "../server/mod.ts";
import { DB } from "https://deno.land/x/sqlite@v3.3.0/mod.ts";

const deps = createDeps();
const app = application(deps);

app.get("/", () => {
  type FunctionType = () => string;
  const fn = <FunctionType> app.getDeps("hello");
  return new Response(fn());
});

app.post("/name", () => {
  const db = <DB> app.getDeps("db");
  const names = ["Peter Parker", "Clark Kent", "Bruce Wayne"];

  for (const name of names) {
    db.query("INSERT INTO people (name) VALUES (?)", [name]);
  }

  return new Response(JSON.stringify(names));
});

app.get("/name", () => {
  const db = <DB> app.getDeps("db");
  const res = db.query("SELECT name FROM people");
  return new Response(JSON.stringify(res));
});

function createDeps(): Deps {
  const deps = new Map<string, unknown>();
  deps.set("hello", () => "Hello world");

  const db = new DB("test.db");
  db.query(`CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  )`);
  deps.set("db", db);
  return deps;
}

console.log("Listening on: http://localhost:8000");

await app.serve();
