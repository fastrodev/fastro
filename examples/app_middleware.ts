import fastro, { Context, HttpRequest, Next } from "../mod.ts";

const f = new fastro();

const m = (req: HttpRequest, _ctx: Context, next: Next) => {
  req.ok = true;
  return next();
};

f.use(m);
f.get("/", (req: HttpRequest, _ctx: Context) => {
  return {
    ok: req.ok,
  };
});

await f.serve();
