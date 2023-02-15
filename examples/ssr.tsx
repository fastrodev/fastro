import fastro, { render } from "../server/mod.ts";
import App from "./pages/app.tsx";
import Hello from "./pages/hello.tsx";
import User from "./pages/user.tsx";

// define a hello component to render
// attach this to page declaration
const hello = render(<Hello />)
  // used for SSR hydration process
  .dir("./examples/pages")
  // with bundle js file name 'hello'
  .bundle("hello");

const app = render(<App />)
  .bundle("app")
  .dir("./examples/pages");

const user = render(<User />)
  .bundle("user")
  .dir("./examples/pages");

const f = fastro()
  // set static endpoint url
  // default folder is at ./public
  // this is a place where hydrated files generated
  .static("/static")
  // set endpoint for app page
  .page("/", hello, (req, res) => {
    // you can access the http request object
    // console.log(req.url);
    return res.ssr(hello)
      // you can inject react props from server
      .render();
  })
  .page("/:user", user, (req, res) => {
    // console.log(req.match);
    // you can access the http request object
    const u = req.match?.pathname.groups.user;
    return res.ssr(user)
      // you can inject react props from server
      .props({ data: u })
      .render();
  })
  // set endpoint for hello page
  .page("/:user/count", app, (req, res) => {
    const user = req.match?.pathname.groups.user;
    return res.ssr(app)
      // and set the html title and other meta data
      // for seo purpose
      .title(`Hello ${user}`)
      .props({ data: user })
      .meta(`name="viewport" content="width=device-width"`)
      .render();
  });

await f.serve();
