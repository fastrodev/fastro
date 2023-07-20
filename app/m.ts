import fastro, { Context, HttpRequest } from "../mod.ts";
import uuid from "../pages/uuid.tsx";
import layout from "./l.ts";

const f = new fastro();
f.get("/api", () => Response.json({ uuid: crypto.randomUUID() }));
f.static("/static", { folder: "static", maxAge: 90 });
f.page(
  "/",
  uuid,
  (_req: HttpRequest, ctx: Context) => {
    const options = layout({
      title: "React component",
      description: "This is simple react component",
    });
    return ctx.render(options);
  },
);

await f.serve();
