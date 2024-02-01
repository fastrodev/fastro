import fastro, { Context, HttpRequest } from "$fastro/mod.ts";

const f = new fastro();

const m1 = (req: HttpRequest, ctx: Context) => {
  // console.log("middleware 1");
  req.m1 = "middleware1";
  return ctx.next();
};

const m2 = (_req: HttpRequest, ctx: Context) => {
  // console.log("middleware 2");
  return ctx.next();
};

const m3 = (_req: HttpRequest, ctx: Context) => {
  // console.log("middleware 3");
  return ctx.next();
};

const m4 = (_req: HttpRequest, ctx: Context) => {
  // console.log("middleware 4");
  return ctx.next();
};

const handler = (req: HttpRequest) => {
  // `middleware1` for get
  // `undefined` for post
  return req.m1;
};

f.get("/", m1, m2, m3, handler);
f.post("/", m4, handler);

await f.serve();
