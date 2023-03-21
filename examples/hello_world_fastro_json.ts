import application, { HttpRequest, HttpResponse } from "../server/mod.ts";

const app = application();

app.get(
  "/",
  (_req: HttpRequest, res: HttpResponse) =>
    res.status(200).json({ status: true }),
);

await app.serve();
