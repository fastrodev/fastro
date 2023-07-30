import fastro, { Context, HttpRequest } from "../mod.ts";
import user from "../pages/user.tsx";

const f = new fastro();

// simulate async method
const getUser = (data: string) => Promise.resolve(data);

// init page with the handler
f.page(
  "/",
  user,
  async (_req: HttpRequest, ctx: Context) => {
    // get data from async method
    const data = await getUser("Guest");

    const options = {
      // pass data to component via props
      props: { data },
      status: 200,
      html: { head: { title: "React Component" } },
    };

    // render react component from server
    return ctx.render(options);
  },
);

// define static path, home for the built JS file
f.static("/static", { folder: "static", maxAge: 90 });

await f.serve();
