import fastro, { Context, HttpRequest, Next } from "../mod.ts";

const f = new fastro();

const m1 = (_req: HttpRequest, _ctx: Context, next: Next) => {
  console.log("middleware 1");
  return next();
};

const m2 = (_req: HttpRequest, _ctx: Context, next: Next) => {
  console.log("middleware 3");
  return next();
};

const m3 = (_req: HttpRequest, _ctx: Context, next: Next) => {
  console.log("middleware 2");
  return next();
};

const handler = () => {
  return "route middleware";
};

f.get("/", m1, m2, m3, handler);

await f.serve();
