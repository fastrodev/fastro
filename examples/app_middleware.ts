import fastro, { Context, HttpRequest, Next } from "../mod.ts";

const f = new fastro();

const m = (req: HttpRequest, ctx: Context, next: Next) => {
  if (req.url === "http://localhost:8000/middleware") {
    return next();
  }
  return ctx.send("root");
};

f.use(m);

await f.serve();
