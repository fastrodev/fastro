import fastro, { HttpRequest } from "../server/mod.ts";

const f = fastro();

f.get("/:user", (req: HttpRequest) => {
  const data = { user: req.params?.user, name: req.query?.name };
  return Response.json(data);
});

await f.serve();
