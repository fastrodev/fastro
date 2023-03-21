import application, { HttpRequest, HttpResponse } from "../server/mod.ts";

const app = application();

app.get(
  "/",
  (req: HttpRequest, res: HttpResponse) =>
    res.status(200).jsx(<h1>Hello, jsx</h1>),
);

await app.serve();
