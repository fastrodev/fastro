import fastro, { Context, HttpRequest } from "../server/mod.ts";

const f = fastro();

f.get(
  "/",
  (_req: HttpRequest, ctx: Context) => {
    return ctx.send({ value: true }, 200);
  },
);

f.serve();
