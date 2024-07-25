import fastro, { Context, HttpRequest } from "@app/mod.ts";
const f = new fastro(
  { "kv": await Deno.openKv() },
);

async function createUser(kv: Deno.Kv) {
  const uuid = crypto.randomUUID();
  await kv.set(["users", "john"], { name: "john", id: uuid });
}

// Get user
f.get("/user", async (req: HttpRequest, ctx: Context) => {
  const kv = ctx.kv;
  const key: string = req.query?.name ?? "";
  const u = await kv.get(["users", key]);
  if (!u) {
    await createUser(kv);
  }
  return Response.json(u.value);
});

await f.serve();
