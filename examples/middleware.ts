import fastro, { HttpRequest, HttpResponse, Next } from "../server/mod.ts";

const f = fastro();

f.use((
  _req: HttpRequest,
  _res: HttpResponse,
  next: Next,
) => {
  new Date();
  next();
});

f.get("/", (
  _req: HttpRequest,
  _res: HttpResponse,
  next: Next,
) => {
  new Date();
  next();
}, () => "Hello world");

await f.serve();
