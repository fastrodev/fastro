import fastro, { Context, HttpRequest } from "../mod.ts";
import user from "../pages/user.page.tsx";
import { uuidModule } from "../uuid/mod.ts";

// simulate async method
const getUser = (data: string) => Promise.resolve(data);

// init server
const f = new fastro();

// setup static folder for JS file
f.static("/static", { folder: "static" });

// setup page handler
const handler = async (_req: HttpRequest, ctx: Context) => {
  // get data from async method
  const data = await getUser("Guest");
  const options = {
    // pass data to component via props
    props: { data },
    status: 200,
    html: { head: { title: "Preact Component" } },
  };

  // render react component from server
  return ctx.render(options);
};

// init default page folder with path and handler
f.page("/", user, handler);

// init ssr with page module
f.register(uuidModule);

await f.serve();
