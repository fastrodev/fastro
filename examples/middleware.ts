import fastro, { HttpRequest, HttpResponse, Next } from "../server/mod.ts";

const f = fastro();

f.use((
  req: HttpRequest,
  _res: HttpResponse,
  next: Next,
) => {
  req.date = new Date();
  next();
});

f.get("/", (
  req: HttpRequest,
  _res: HttpResponse,
  next: Next,
) => {
  req.value = "Hello world";
  next();
}, (req: HttpRequest, res: HttpResponse) => {
  return res.json({
    date: req.date,
    value: req.value,
  });
});

await f.serve();
