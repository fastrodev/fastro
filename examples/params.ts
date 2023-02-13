import fastro from "../server/mod.ts";

const f = fastro();

f.get("/:user", (req, res) => {
  const r = req.params();
  if (!r) return res.send("not found");
  const { user } = r;
  return res.json({ user });
}).get("/", (_req, res) => {
  return res.send("Hello params");
});

await f.serve();
