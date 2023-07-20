import fastro, { Context, HttpRequest } from "../http/server.ts";
import user from "../pages/user.tsx";

const f = new fastro();

f.static("/static", { folder: "static", maxAge: 90 });
f.page(
  "/",
  user,
  (_req: HttpRequest, ctx: Context) => {
    const options = {
      props: { data: "Guest" },
      status: 200,
      html: { head: { title: "React Component" } },
    };
    return ctx.render(options);
  },
);

await f.serve();
