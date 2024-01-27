import fastro, { HttpRequest } from "$fastro/mod.ts";

const f = new fastro();

f.get("/:user", (req: HttpRequest) => {
  const data = { user: req.params?.user, name: req.query?.title };
  return Response.json(data);
});

await f.serve();
