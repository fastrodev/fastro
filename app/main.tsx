import Server from "../mod.ts";
import hello from "./hello.page.tsx";
import dear from "./dear.page.tsx";
import { layout } from "./layout.tsx";

const s = new Server();

const y = <p>JSX</p>;

s.get("/hello", (_req, ctx) => {
  return ctx.render(<h1>Hello</h1>);
});

s.get("/hello/:user", (_req, ctx) => {
  return ctx.render(<h1>Hello {ctx.params?.user}</h1>);
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
  folder: "app",
  handler: (req, ctx) => {
    return ctx.render({ title: "halaman dear", data: "okeee ya" });
  },
});

s.page("/profile/:user", {
  component: dear,
  layout,
  folder: "app",
  handler: (req, ctx) => {
    return ctx.render({
      title: "halaman profile",
      data: "profilemu",
      user: ctx.params?.user,
    });
  },
});

s.serve();
