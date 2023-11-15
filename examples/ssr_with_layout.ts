import fastro, { Context, HttpRequest } from "$fastro/mod.ts";
import user from "$fastro/pages/user.page.tsx";
import { uuidModule } from "$fastro/uuid/mod.ts";
import { layout } from "$fastro/pages/layout.tsx";

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
