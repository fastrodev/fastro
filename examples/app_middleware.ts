import fastro, { Context, HttpRequest } from "$fastro/mod.ts";

const f = new fastro();

const m = (req: HttpRequest, ctx: Context) => {
  req.ok = true;
  ctx.msg = "hello";
  ctx.getTitle = () => "oke";
  return ctx.next();
};

f.use(m);

f.get("/", (req: HttpRequest, ctx: Context) => {
  return {
    ok: req.ok,
    msg: ctx.msg,
    title: ctx.getTitle(),
  };
});

await f.serve();
