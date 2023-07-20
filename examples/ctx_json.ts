import fastro, { Context, HttpRequest } from "../http/server.ts";

const f = new fastro();

f.get(
  "/",
  (_req: HttpRequest, ctx: Context) => {
    return ctx.send({ value: true }, 200);
  },
);

await f.serve();
