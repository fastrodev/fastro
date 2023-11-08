import fastro, { Context, HttpRequest, RenderOptions } from "../mod.ts";
import user from "../pages/user.page.tsx";

const f = new fastro();
f.static("/static", { folder: "static" });

const htmlLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
};

const handler = (_req: HttpRequest, ctx: Context) => {
  const options: RenderOptions = {
    props: { data: "Guest" },
    layout: htmlLayout,
  };

  return ctx.render(options);
};

f.page("/", user, handler);

await f.serve();
