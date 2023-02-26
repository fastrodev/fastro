import application from "../server/mod.ts";
import { HttpRequest, HttpResponse } from "../server/types.ts";

const app = application();

app.get(
  "/",
  (_req: HttpRequest, res: HttpResponse) =>
    res.status(200).html("<h1>Hello</h1>"),
);

await app.serve();
