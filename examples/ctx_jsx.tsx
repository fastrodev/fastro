import fastro, { Context, HttpRequest } from "@app/mod.ts";

const f = new fastro();

f.get(
  "/",
  (_req: HttpRequest, ctx: Context) => {
    return ctx.render(<h1>Hello, jsx!</h1>);
  },
);

await f.serve();
