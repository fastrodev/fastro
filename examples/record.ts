import fastro, { Context, Fastro, HttpRequest } from "../mod.ts";

const f = new fastro();

const recordModule = (f: Fastro) => {
  f.record["data"] = { value: "Hello" };
  return f;
};

const apiModule = (f: Fastro) => {
  return f.get("/", (req: HttpRequest, ctx: Context) => {
    return ctx.send(req.record["data"]);
  });
};

f.register(recordModule);
f.register(apiModule);

await f.serve();
