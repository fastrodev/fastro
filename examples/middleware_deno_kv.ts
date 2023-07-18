import fastro, { Context, HttpRequest, Next } from "../mod.ts";

const uuid = crypto.randomUUID();
const f = new fastro();

// run deno with --unstable
const kv = await Deno.openKv();
// add initial data to deno kv
kv.set(["users", "john"], { name: "john", id: uuid });
f.record["kv"] = kv;

// add parameterized endpoint with route level middleware
f.get("/:user", async (
  req: HttpRequest,
  _ctx: Context,
  next: Next,
) => {
  const kv = req.record["kv"] as Deno.Kv;

  // get existing data
  const key: string = req.query?.name ?? "";
  const u = await kv.get(["users", key]);
  const data = u.value as object;

  // add path to object
  const path = { path: req.url };
  kv.set(["users", key], { ...data, ...path });

  return next();
}, async (req: HttpRequest, _ctx: Context) => {
  // get the initialized kv data
  const kv: Deno.Kv = req.record["kv"];
  const key: string = req.query?.name ?? "";
  const u = await kv.get(["users", key]);
  return Response.json(u.value);
});

await f.serve();
