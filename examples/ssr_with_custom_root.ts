import fastro, { Context, HttpRequest } from "../mod.ts";
import user from "../pages/user.page.tsx";
import { customRoot, layout } from "../pages/layout.tsx";

const props = { data: "Guest", title: "React Component" };

const handler = (_req: HttpRequest, ctx: Context) => {
  return ctx.render({ props, layout, customRoot });
};

const f = new fastro();
f.static("/static", { folder: "static" });
f.page("/", user, handler);
await f.serve();
