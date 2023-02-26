import fastro from "../server/mod.ts";
import { HttpRequest, HttpResponse } from "../server/types.ts";

const f = fastro();

f.get("/:user", (req: HttpRequest, res: HttpResponse) => {
  const r = req.match?.pathname.groups;
  if (!r) return res.send("not found");
  const { user } = r;
  return res.json({ user });
}).get("/", (_req: HttpRequest, res: HttpResponse) => {
  return res.send("Hello params");
});

await f.serve();
