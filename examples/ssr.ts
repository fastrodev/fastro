import app from "../pages/app.tsx";
import fastro, { Context, HttpRequest, Next } from "../server/mod.ts";

const f = fastro();

f.get("/api", () => Response.json({ msg: "hello" }));
f.static("/static", { folder: "static", maxAge: 90 });
f.page(
  "/page",
  app,
  (_req: HttpRequest, _ctx: Context, next: Next) => {
    console.log(new Date());
    return next();
  },
  (_req: HttpRequest, ctx: Context) => {
    const options = {
      status: 200,
      html: { head: { title: "React Component" } },
    };
    return ctx.props({ data: "Guest" }).render(options);
  },
);

await f.serve();
