import { Database } from "https://deno.land/x/sqlite3@0.10.0/mod.ts";
import fastro, { Context, HttpRequest } from "$fastro/mod.ts";

const db = new Database("sqlite.db");

function getData() {
  const [version] = db.prepare("select sqlite_version()").value<[string]>()!;
  return version;
}

const f = new fastro();

f.get("/", (_req: HttpRequest, ctx: Context) => {
  const data = getData();
  return ctx.send(data, 200);
});

await f.serve();
