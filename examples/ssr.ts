import App from "../pages/app.tsx";
import fastro, {
  Context,
  HttpRequest,
  Next,
  RenderOptions,
} from "../server/mod.ts";

const f = fastro();

f.get("/api", () => Response.json({ msg: "hello" }));
f.static("/static", { folder: "static", maxAge: 90 });
f.page(
  "/page",
  App,
  (_req: HttpRequest, _ctx: Context, next: Next) => {
    console.log(new Date());
    return next();
  },
  (_req: HttpRequest, ctx: Context) => {
    const options: RenderOptions = {
      cache: true,
      pageFolder: "pages",
      status: 200,
      html: {
        head: {
          title: "React component",
          descriptions: "This is a react component",
        },
      },
    };
    return ctx.props({ data: "Guest" }).render(options);
  },
);

f.serve();
