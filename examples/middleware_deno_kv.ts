import fastro, { Context, HttpRequest, Next } from "../mod.ts";

const f = new fastro();
f.record["init"] = "Hello";
// run deno with --unstable
f.record["kv"] = await Deno.openKv();

f.static("/public", { maxAge: 90, folder: "/bench" });

// add endpoint
f.get("/", () => {
  return new Response("root");
});

// add application level middleware
f.use((req: HttpRequest, _ctx: Context, next: Next) => {
  req.record["value"] = crypto.randomUUID();
  const kv: Deno.Kv = req.record["kv"];
  kv.set(["users", "john"], { name: "john", id: crypto.randomUUID() });
  return next();
});

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
