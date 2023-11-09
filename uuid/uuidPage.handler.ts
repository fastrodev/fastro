import { layout } from "../pages/layout.tsx";
import { Context, HttpRequest } from "../mod.ts";

const getUser = (data: string) => Promise.resolve(data);

export default async function pageHandler(_req: HttpRequest, ctx: Context) {
  const data = await getUser("Guest");

  const options = {
    props: { data, title: "UUID" },
    status: 200,
    layout,
  };

  return ctx.render(options);
}
