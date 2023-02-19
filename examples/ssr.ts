import App from "../pages/app.tsx";
import Hello from "../pages/hello.tsx";
import User from "../pages/user.tsx";
import fastro, { HttpResponse, render, SSR } from "../server/mod.ts";

const hello = render(Hello);
const app = render(App);
const user = render(User);

function createSSR(res: HttpResponse, ssr: SSR) {
  const [css, js, meta] = [
    `href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous"`,
    `src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"`,
    `name="viewport" content="width=device-width"`,
  ];
  return res.ssr(ssr)
    .link(css)
    .script(js)
    .meta(meta);
}

const f = fastro()
  .page("/", hello, (_req, res) => {
    return res.ssr(hello)
      .title(`Hello`)
      .render();
  })
  .page("/:user", user, (req, res) => {
    const data = req.match?.pathname.groups.user;
    return createSSR(res, user)
      .props({ data })
      .render();
  })
  .page("/:user/count", app, (req, res) => {
    const data = req.match?.pathname.groups.user;
    return createSSR(res, app)
      .title(`Hello ${data}`)
      .props({ data })
      .render();
  });

await f.serve();
