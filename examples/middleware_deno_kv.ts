import fastro, { Context, HttpRequest, Next } from "../mod.ts";

const uuid = crypto.randomUUID();
const f = new fastro();

// run deno with --unstable
const kv = await Deno.openKv();
kv.set(["users", "john"], { name: "john", id: uuid });
f.record["kv"] = kv;

// add parameterized endpoint with route level middleware
f.get("/:user", (
  _req: HttpRequest,
  _ctx: Context,
  next: Next,
) => {
  return next();
}, async (req: HttpRequest, _ctx: Context) => {
  // get the initialized kv data
  const kv: Deno.Kv = req.record["kv"];
  const key: string = req.query?.name ? req.query?.name : "";
  const u = await kv.get(["users", key]);
  return Response.json(u.value);
});

f.post("/:user", async (req: HttpRequest, _ctx: Context) => {
  // get the initialized kv data
  const kv: Deno.Kv = req.record["kv"];
  const key: string = req.query?.name ? req.query?.name : "";
  const u = await kv.get(["users", key]);
  return Response.json(u.value);
});

await f.serve();
