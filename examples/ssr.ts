import app from "../pages/app.tsx";
import fastro, { Context, HttpRequest } from "../server/mod.ts";

const f = new fastro();

f.get("/api", () => Response.json({ msg: "hello" }));
f.static("/static", { folder: "static", maxAge: 90 });
f.page(
  "/",
  app,
  (_req: HttpRequest, ctx: Context) => {
    const options = {
      status: 200,
      html: { head: { title: "React Component" } },
    };
    return ctx.props({ data: "Guest" }).render(options);
  },
);

await f.serve();
