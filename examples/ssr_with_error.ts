import fastro, { Context, HttpRequest } from "$fastro/mod.ts";
import user from "$fastro/pages/user.page.tsx";
import { uuidModule } from "$fastro/uuid/mod.ts";
import { layout } from "$fastro/pages/layout.tsx";

const getUser = (data: string) => Promise.resolve(data);
const handler = async (_req: HttpRequest, ctx: Context) => {
  const onError = (error: unknown) => console.error(error);
  const ac = new AbortController();
  setTimeout(() => ac.abort(), 10000);
  const data = await getUser("Guest");
  const options = {
    props: { data },
    status: 200,
    layout,
    onError,
    abortController: ac,
  };

  return ctx.render(options);
};

const f = new fastro();
f.static("/static", { folder: "static" });
f.page("/", user, handler);
f.register(uuidModule);

await f.serve();
