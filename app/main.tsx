import Server from "../mod.ts";
import hello from "./hello.page.tsx";
import dear from "./dear.page.tsx";
import indexApp from "./index.page.tsx";
import { layout } from "./app.layout.tsx";
import { index } from "./index.layout.tsx";
import { tailwind } from "../middleware/tailwind/mod.ts";
import markdown from "../middleware/markdown/mod.tsx";
import blogLayout from "./blog.layout.tsx";
import docsLayout from "./docs.layout.tsx";
import { HttpRequest } from "../http/server/types.ts";

function denoRunCheck(req: HttpRequest) {
  const regex = /^Deno\/(\d+\.\d+\.\d+)$/;
  const string = req.headers.get("user-agent");
  if (!string) return false;
  const match = regex.exec(string);
  if (!match) return false;
  return true;
}

function init() {
  const basePath = Deno.env.get("DENO_DEPLOYMENT_ID")
    ? `https://raw.githubusercontent.com/fastrodev/fastro/preact/static`
    : "http://localhost:8000";
  const code =
    `import init from "${basePath}/init.ts"; const name = Deno.args[0] ?? 'project'; await init(name);`;
  return new Response(code, {
    headers: {
      "content-type": "application/typescript; charset=utf-8",
    },
  });
}

const s = new Server();

/** markdown with default folder and prefix */
s.use(markdown(blogLayout));

/** markdown with 'docs' folder and prefix */
s.use(markdown(docsLayout, "docs", "docs"));

/** setup tailwind */
s.use(tailwind());

s.use((req, ctx) => {
  req.oke = "oke";
  return ctx.next();
});

s.get("/docs", (req, ctx) => {
  return Response.redirect("http://localhost:8000/docs/start", 307);
});

s.page("/", {
  component: indexApp,
  layout: index,
  folder: "app",
  handler: (req, ctx) => {
    denoRunCheck(req);
    const res = denoRunCheck(req);
    if (res) return init();
    return ctx.render({
      title: "Full Stack Framework for BFF, SSR, Preact & Deno",
      description:
        "Speed without complexity. Handle thousands of RPS with a minimalistic API. Small-sized JavaScript bundle.",
      image: "profilemu.png",
    });
  },
});

s.get("/m", (req) => {
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
  return ctx.render(<h1>Hello {req.params?.user}</h1>);
});

s.page("/page", {
  component: hello,
  layout,
  folder: "app",
  handler: (req, ctx) => {
    console.log(req.oke);
    console.log(req.page);
    return ctx.render({ title: "halaman page", data: "okeee page" });
  },
}, (req, ctx) => {
  req.page = "page";
  return ctx.next();
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
      user: req.params?.user,
    });
  },
}, (req, ctx) => {
  console.log("params", req.params?.user);
  return ctx.next();
});

type User = {
  userName: string;
  firstName: string;
  email: string;
};

s.post("/post", async (req, ctx) => {
  const b = await req.parseBody<User>();
  return ctx.send(b);
});

s.serve();
