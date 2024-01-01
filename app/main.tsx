import Server from "../mod.ts";
import hello from "./hello.page.tsx";
import dear from "./dear.page.tsx";
import { layout } from "./layout.tsx";

const s = new Server();

s.use((req, ctx) => {
  req.oke = "oke";
  return ctx.next();
});

s.get("/", (req) => {
  console.log("req.no", req.no);
  console.log("req.ng", req.ng);
  return new Response("hello");
}, (req, ctx) => {
  req.no = "no";
  return ctx.next();
}, (req, ctx) => {
  req.ng = "ng";
  return ctx.next();
});

s.get("/hello", (req, ctx) => {
  console.log(req.oke);
  console.log("req.no", req.no); // undefined
  console.log("req.ng", req.ng); // undefined
  return ctx.render(<h1>Hello</h1>);
});

s.get("/hello/:user", (req, ctx) => {
  console.log(req.oke);
  return ctx.render(<h1>Hello {ctx.params?.user}</h1>);
});

s.page("/page", {
  component: hello,
  layout,
  folder: "app",
  handler: (req, ctx) => {
    console.log(req.oke);
    return ctx.render({ title: "halaman page", data: "okeee page" });
  },
});

s.page("/dear", {
  component: dear,
  layout,
  folder: "app",
  handler: (req, ctx) => {
    console.log(req.oke);
    return ctx.render({ title: "halaman dear", data: "okeee ya" });
  },
});

s.page("/profile/:user", {
  component: dear,
  layout,
  folder: "app",
  handler: (req, ctx) => {
    console.log(req.oke);
    return ctx.render({
      title: "halaman profile",
      data: "profilemu",
      user: ctx.params?.user,
    });
  },
});

s.serve();
