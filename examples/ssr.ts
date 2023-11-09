import fastro, { Context, HttpRequest } from "../mod.ts";
import user from "../pages/user.page.tsx";
import { uuidModule } from "../uuid/mod.ts";
import { layout } from "../pages/layout.tsx";

const getUser = (data: string) => Promise.resolve(data);
const handler = async (_req: HttpRequest, ctx: Context) => {
  const data = await getUser("Guest");
  return ctx.render({
    layout,
    props: { data, title: "React Component" },
    status: 200,
  });
};

const f = new fastro();
f.static("/static", { folder: "static" });
f.page("/", user, handler);
f.register(uuidModule);

await f.serve();
