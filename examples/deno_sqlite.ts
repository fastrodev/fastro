import { Database } from "jsr:@db/sqlite";
import fastro, { Context, HttpRequest } from "@app/mod.ts";

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
