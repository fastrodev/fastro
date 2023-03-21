import fastro, { HttpRequest, HttpResponse } from "../server/mod.ts";

const f = fastro();

f.get("/:user", (req: HttpRequest, res: HttpResponse) => {
  const data = { user: req.params("user"), title: req.query("title") };
  return res.json(data);
});

await f.serve();
