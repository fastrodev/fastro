import fastro, { Context, HttpRequest, Next } from "../mod.ts";

const f = new fastro();

const m1 = (req: HttpRequest, _ctx: Context, next: Next) => {
  console.log("middleware 1");
  req.m1 = "middleware1";
  return next();
};

const m2 = (_req: HttpRequest, _ctx: Context, next: Next) => {
  console.log("middleware 2");
  return next();
};

const m3 = (_req: HttpRequest, _ctx: Context, next: Next) => {
  console.log("middleware 3");
  return next();
};

const m4 = (_req: HttpRequest, _ctx: Context, next: Next) => {
  console.log("middleware 4");
  return next();
};

const handler = (req: HttpRequest) => {
  // `middleware1` for get
  // `undefined` for post
  return req.m1;
};

f.get("/", m1, m2, m3, handler);
f.post("/", m4, handler);

await f.serve();
