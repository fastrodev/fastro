import Server from "./server.ts";
import hello from "./app/hello.page.tsx";
import dear from "./dear.page.tsx";
import { layout } from "./app/layout.tsx";

const s = new Server();

const y = <p>JSX</p>;

s.get("/hello", (_req, ctx) => {
  return ctx.render(<h1>Hello</h1>);
});
s.get("/", (_req, _info) => {
  return new Response("hello");
});
s.page("/page", {
  component: hello,
  layout,
  folder: "app",
  handler: (_req, ctx) => {
    return ctx.render({ title: "halaman page", data: "okeee page" });
  },
});

s.page("/dear", {
  component: dear,
  layout,
  handler: (req, ctx) => {
    return ctx.render({ title: "halaman dear", data: "okeee ya" });
  },
});

s.static("/static", { folder: "static" });
s.serve();
