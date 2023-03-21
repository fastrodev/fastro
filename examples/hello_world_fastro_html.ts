import application, { HttpRequest, HttpResponse } from "../server/mod.ts";

const app = application();

app.get(
  "/",
  (_req: HttpRequest, res: HttpResponse) =>
    res.status(200).html("<h1>Hello</h1>"),
);

await app.serve();
