import fastro, { Context, HttpRequest } from "$fastro/mod.ts";

const uuid = crypto.randomUUID();
const f = new fastro();

// run deno with --unstable
const kv = await Deno.openKv();
// add initial data to deno kv
await kv.set(["users", "john"], { name: "john", id: uuid });
f.record["kv"] = kv;

// add parameterized endpoint with route level middleware
// http://localhost:8000/user?name=john
f.get("/:user", async (req: HttpRequest, _ctx: Context) => {
  // get the initialized kv data
  const kv: Deno.Kv = req.record["kv"];
  const key: string = req.query?.name ?? "";
  const u = await kv.get(["users", key]);
  return Response.json(u.value);
});

await f.serve();
