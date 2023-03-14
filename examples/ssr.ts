import App from "../pages/app.tsx";
import Hello from "../pages/hello.tsx";
import User from "../pages/user.tsx";
import fastro, { createSSR, HttpResponse, SSR } from "../server/mod.ts";
import { HttpRequest } from "../server/types.ts";

const hello = createSSR(Hello);
const app = createSSR(App);
const user = createSSR(User);

const f = fastro()
  .page("/", hello, (_req: HttpRequest, res: HttpResponse) => {
    const desc = "Fastro React SSR Example";
    return initSSR(hello, res)
      .ogImage("https://deno.land/images/artwork/v1.png")
      .metaDesc(desc)
      .title(`Hello`)
      .lang("EN")
      .render();
  })
  .page("/:user", user, (req: HttpRequest, res: HttpResponse) => {
    const data = req.match?.pathname.groups.user;
    return initSSR(user, res)
      .props({ data })
      .render();
  })
  .page("/:user/app", app, (req: HttpRequest, res: HttpResponse) => {
    const data = req.match?.pathname.groups.user;
    return initSSR(app, res)
      .title(`Hello ${data}`)
      .props({ data })
      .render();
  });

f.get("/api", (_req: HttpRequest, res: HttpResponse) => {
  return res.json({ msg: "hello" });
});

await f.serve();

function initSSR(ssr: SSR, res: HttpResponse) {
  const [css, js, meta, center, dark] = [
    `href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous"`,
    `src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"`,
    `name="viewport" content="width=device-width, initial-scale=1"`,
    `class="container d-flex align-items-center" style="height: 100vh;"`,
    `data-bs-theme="dark"`,
  ];
  return res.ssr(ssr)
    .htmlAttr(dark)
    .rootAttr(center)
    .link(css)
    .script(js)
    .meta(meta);
}
