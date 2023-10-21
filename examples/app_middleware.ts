import fastro, { Context, HttpRequest, Next } from "../mod.ts";

const f = new fastro();

const m = (req: HttpRequest, ctx: Context, next: Next) => {
  req.ok = true;
  return next();
};

f.use(m);
f.get("/", (req: HttpRequest, ctx: Context) => {
  return {
    ok: req.ok,
  };
});

await f.serve();
