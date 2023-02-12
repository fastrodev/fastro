import application from "../server/mod.ts";

const app = application();

app.get("/:user", (req, res) => {
  const u = req.params;
  return res.json({ user: u });
});

await app.serve();
