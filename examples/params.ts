import fastro from "../server/mod.ts";
import { HttpRequest, HttpResponse } from "../server/types.ts";

const f = fastro();

f.get("/:user", (req: HttpRequest, res: HttpResponse) => {
  return res.json({ user: req.params("user"), title: req.query("title") });
}).get("/", (_req: HttpRequest, res: HttpResponse) => {
  return res.send("Hello params");
});

await f.serve();
