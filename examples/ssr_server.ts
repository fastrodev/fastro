import App from "../pages/app.tsx";
import Hello from "../pages/hello.tsx";
import Register from "../pages/register.tsx";
import User from "../pages/user.tsx";
import fastro, { render } from "../server/mod.ts";

// define a hello component to render
// attach this to page declaration
const hello = render(Hello);
const app = render(App);
const user = render(User);
const register = render(Register);

const f = fastro()
  // set endpoint for app page
  .page("/", register, (_req, res) => {
    const css =
      `href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous"`;
    const js =
      `src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"`;

    return res.ssr(register)
      // add bootstrap css
      .link(css)
      .script(js)
      .render();
  })
  .page("/:user", user, (req, res) => {
    // you can access the http request object
    const u = req.match?.pathname.groups.user;
    return res.ssr(user)
      // you can inject react props from server
      .props({ data: u })
      .link(
        `rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"`,
      )
      .render();
  })
  .page("/:user/count", app, (req, res) => {
    const user = req.match?.pathname.groups.user;
    return res.ssr(app)
      // and set the html title and other meta data
      // for seo purpose
      .title(`Hello ${user}`)
      .link(
        `rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"`,
      )
      .props({ data: user })
      .meta(`name="viewport" content="width=device-width"`)
      .render();
  })
  .page("/app/register", hello, (_req, res) => {
    return res.ssr(hello)
      // and set the html title and other meta data
      // for seo purpose
      .title(`Register`)
      .link(
        `href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous"`,
      )
      .link(`/static/app.css" rel="stylesheet"`)
      .meta(`name="viewport" content="width=device-width"`)
      .render();
  });

await f.serve();
