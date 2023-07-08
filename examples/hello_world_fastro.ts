import fastro, { Context, HttpRequest } from "../server/mod.ts";

const f = fastro();

f.get(
  "/",
  (_req: HttpRequest, ctx: Context) => {
    return ctx.send("Helo world", 200);
  },
);

await f.serve();
