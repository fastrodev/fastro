import { fastro, getParam, getParams } from "../server/mod.ts";

const app = fastro();

app.get("/:id/user/:name", (req: Request) => {
  const params = getParams(req);
  return new Response(JSON.stringify({ params }));
});

app.get("/post/:id", (req: Request) => {
  const param = getParam("id", req);
  return new Response(JSON.stringify({ param }));
});

await app.serve();
