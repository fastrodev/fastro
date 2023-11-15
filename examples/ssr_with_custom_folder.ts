import fastro, { Context, HttpRequest } from "$fastro/mod.ts";
import uuid from "$fastro/uuid/uuid.page.tsx";
import { uuidService } from "$fastro/uuid/uuid.service.ts";

export function apiHandler(_req: Request) {
  return uuidService();
}

const getUser = (data: string) => Promise.resolve(data);
const handler = async (_req: HttpRequest, ctx: Context) => {
  const data = await getUser("Guest");
  return ctx.render({
    props: { data, title: "React Component" },
    status: 200,
  });
};

const f = new fastro();
f.static("/static", { folder: "static" });
f.page("/", { component: uuid, folder: "uuid" }, handler);
f.get("/api", apiHandler);

await f.serve();
