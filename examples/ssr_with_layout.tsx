import fastro, { Context, HttpRequest, RenderOptions } from "../mod.ts";
import user from "../pages/user.page.tsx";

const f = new fastro();
f.static("/static", { folder: "static" });

function htmlLayout(
  { children, data: { title } }: {
    children: React.ReactNode;
    data: { title: string };
  },
) {
  return (
    <html lang="en">
      <head>
        <title>{title}</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

const handler = (_req: HttpRequest, ctx: Context) => {
  const options: RenderOptions = {
    props: { data: "Guest", title: "React Component" },
    layout: htmlLayout,
  };

  return ctx.render(options);
};

f.page("/", user, handler);

await f.serve();
