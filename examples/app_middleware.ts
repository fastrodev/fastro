import fastro, { Context, HttpRequest } from "$fastro/mod.ts";

const f = new fastro();

const m = (req: HttpRequest, ctx: Context) => {
  req.ok = true;
  return ctx.next();
};

f.use(m);
f.get("/", (req: HttpRequest, _ctx: Context) => {
  return {
    ok: req.ok,
  };
});

await f.serve();
