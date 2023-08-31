import { Context, HttpRequest } from "../mod.ts";

const getUser = (data: string) => Promise.resolve(data);

export default async function pageHandler(_req: HttpRequest, ctx: Context) {
  const data = await getUser("Guest");

  const options = {
    props: { data },
    status: 200,
    html: { head: { title: "Preact Component" } },
  };

  return ctx.render(options);
}
